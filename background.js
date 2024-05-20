const API_KEY = 'AIzaSyCokn3AF2CoXMfRIlcJDrm8klYgVpeH_po';

chrome.action.onClicked.addListener(async (tab) => {
    
    const VIDEO_PATTERN = /^https:\/\/www\.youtube\.com\/watch\?v=/;

    if(VIDEO_PATTERN.test(tab.url)){
        console.log("This is a youtube video");

        const urlParams = new URLSearchParams(new URL(tab.url).search);
        const videoId = urlParams.get('v');
        console.log(videoId);

        const channelId = await getChannelID(videoId);
        console.log(channelId);

        const playlists = await getPlaylists(channelId);
        console.log(playlists.length);

        for(const playlist of playlists){
            const playlistId = playlist['id'];
            const [found, index] = await isVideoInPlaylist(playlistId, videoId);
            if(found){
                const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
                const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
                const combinedUrl = `${videoUrl}&list=${playlistId}&index=${index}`;
                console.log(`Video URL: ${videoUrl}`);
                console.log(`Playlist URL: ${playlistUrl}`);
                console.log(`Direct link to video in playlist ${combinedUrl}`);
                chrome.tabs.create({
                    url: playlistUrl
                });
            } 
        }  
        
    } else {
        console.log("This is not a youtube video");
    }
});

async function getChannelID(videoId) {
  
    const myUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&part=snippet&id=${videoId}`;
    try {
        const response = await fetch(myUrl);
        const data = await response.json();
        return data.items[0].snippet.channelId;
    } catch (err) {
        console.error('Failed to fetch channel ID', err);
        return null;
    }
}

async function getPlaylists(channelId){
    let pageToken = null;
    let playlists = [];

    do {
        let myUrl = `https://www.googleapis.com/youtube/v3/playlists?key=${API_KEY}&part=snippet&channelId=${channelId}&maxResults=50`

        if (pageToken) {
            myUrl += `&pageToken=${pageToken}`;
        }
        try {
            const response = await fetch(myUrl);
            const data = await response.json();
            playlists = playlists.concat(data.items);
            pageToken = data.nextPageToken;
        } catch (err) {
            console.error('Failed to fetch playlists', err);  
            break;
        }
    } while (pageToken);

    return playlists;
}

async function isVideoInPlaylist(playlistId, vidId){
    let pageToken = null;
    let index = 1;

    do {
        let myUrl = `https://youtube.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&part=snippet&playlistId=${playlistId}`;

        if (pageToken) {
            myUrl +=  `&pageToken=${pageToken}`;
        }
        try {
            const response = await fetch(myUrl);
            const data = await response.json();
            // can speed up by putting vidId directly in url and seeing if search returns true, but lose index ability?
            for (const item of data.items) {
                if(item.snippet.resourceId.videoId === vidId) {
                    return [true, index];
                }
                index += 1
            }
            pageToken = data.nextPageToken;
        } catch (err) {
            console.error('Failed to fetch playlist', err);  
            break;
        }
    } while (pageToken);
    return [false, null];
}