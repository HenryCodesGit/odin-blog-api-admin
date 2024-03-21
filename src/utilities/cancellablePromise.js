export default function cancellablePromise(promise){
    let _isCancelled = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise
        .then((val)=>{ 
            if(_isCancelled){
                return reject({isCancelled: true})
            }
            return resolve(val);
        })
        .catch((err)=>{ 
            if(_isCancelled){
                return reject({isCancelled: true})
            }
            return reject(err);
        });
    });
    
    return [ 
        wrappedPromise, 
        function cancel(){ 
            _isCancelled = true;
        }
    ];
}