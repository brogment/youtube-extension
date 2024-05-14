
chrome.action.onClicked.addListener(async (tab) => {
    
    const videoPattern = /^https:\/\/www\.youtube\.com\/watch\?v=/;

    if(videoPattern.test(tab.url)){
        console.log("This is a youtube video");

        const VIDEO_ID = tab.url.substring(tab.url.indexOf('=') + 1);
        console.log(VIDEO_ID);

        const CHANNEL_ID = async (videoID) => {
            const apiKey = 'AIzaSyCokn3AF2CoXMfRIlcJDrm8klYgVpeH_po';
            const myURL = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=snippet&id=${videoID}`;

            try {
                const response = await fetch(myURL);
                const data = await response.json();
                return data.items[0].snippet.channelId;
            } catch (err) {
                console.error(err);
            }
        };
        console.log(CHANNEL_ID(VIDEO_ID));
    } else {
        console.log("This is not a youtube video");
    }
});
