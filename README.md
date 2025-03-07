## Youtube Extension Project
This is an personal project for learning purposes that adds features to YouTube that I believe would make the user experience better.
Goals:
* Ability to directly go to playlist a video is contained within (DONE)
* Opening a playlist that contains all of a channels videos (TODO)
* Being able to sort playlist in chronological order (TODO)

### To Use:
Clone the repo somewhere and create a .env file containing your YouTube Data API v3 key in that directory.\
Turn on developer mod on your browser's extension page, select load unpacked, choose the directory.
Then run:

```
npm start 
```
If you are on a youtube video, after clicking the extention button or pressng ctrl+B (if that keybind isn't being used by some other process on your PC) it will open all playlists that video is contained within in new tabs.
