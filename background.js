const API_KEY = 'AIzaSyCokn3AF2CoXMfRIlcJDrm8klYgVpeH_po';

chrome.action.onClicked.addListener(async (tab) => {
    
    const VIDEO_PATTERN = /^https:\/\/www\.youtube\.com\/watch\?v=/;

    if(VIDEO_PATTERN.test(tab.url)){
        console.log("This is a youtube video");

        const videoId = tab.url.substring(tab.url.indexOf('=') + 1);
        console.log(videoId);

        const channelId = await getChannelID(videoId);
        console.log(channelId);

        const playlists = await getPlaylists(channelId);
        console.log(playlists.length);

        for(playlist of playlists){

            const [found, index] = await isVideoInPlaylist(playlist['id'], videoId);
            if(found) console.log('video found in playlist ' + playlist['id']);
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

            for (item of data.items) {
                console.log(item);
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