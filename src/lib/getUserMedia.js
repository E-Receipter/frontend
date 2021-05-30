export default async function (options) {
    if (navigator === undefined)
        throw Error('navigator undefined');
    if (navigator.mediaDevices === undefined) {
        if (navigator.mediaDevices.getUserMedia === undefined) {
            // check older versions
            const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            return await new Promise(
                (resolve, reject) => {
                    getUserMedia.call(
                        navigator,
                        options,
                        resolve,
                        reject,
                    )
                }
            );
        }
    } else {
        return await navigator.mediaDevices.getUserMedia(options);
    }
    throw Error('UserMedia not found');
}