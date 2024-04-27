chrome.action.onClicked.addListener((tab) => {
    if(tab.url && tab.url.includes("youtube.com/watch?v=")) {
       const urlParams = new URLSearchParams(new URL(tab.url).search);
       const videoId = urlParams.get('v');

       if(videoId){
        fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&videoId=${videoId}&key=AIzaSyCokn3AF2CoXMfRIlcJDrm8klYgVpeH_po`)
            .then(response => response.json())
            .then(data => {
                if(data.items.length > 0){
                    const playlistId = data.items[0].id;
                    chrome.tabs.create({ url: `https://www.youtube.com/playlist?list=${playlistId}`});
                }
            });
       }
    }
});