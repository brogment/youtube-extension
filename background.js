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
            console.log(data);
            playlists = playlists.concat(data.items);
            pageToken = data.nextPageToken;
        } catch (err) {
            console.error('Failed to fetch playlists', err);  
            break;
        }
    } while (pageToken);

    return playlists;
}