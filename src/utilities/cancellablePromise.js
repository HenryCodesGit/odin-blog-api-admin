export default function cancellablePromise(promise){
    let _isCancelled = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise
        .then((val)=>{ 
            if(_isCancelled){
                console.log('Promise was cancelled');
                return reject({isCancelled: true})
            }
            return resolve(val);
        })
        .catch((err)=>{ 
            if(_isCancelled){
                console.log('Promise was cancelled');
                return reject({isCancelled: true})
            }
            return reject(err);
        });
    });
    
    return [ 
        wrappedPromise, 
        function cancel(){ 
            console.log('Cancelling promise');
            _isCancelled = true;
        }
    ];
}