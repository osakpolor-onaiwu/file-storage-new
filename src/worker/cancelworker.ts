import { parentPort } from 'worker_threads';

export default (isCancelled = false) => {

    if (parentPort)
        parentPort.once('message', message => {
            if (message === 'cancel') isCancelled = true;
        });
    return isCancelled;
}


