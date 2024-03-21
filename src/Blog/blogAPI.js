// TODO: Make into its own package later

import cancellablePromise from '/src/utilities/cancellablePromise'

const BLOG_URL = import.meta.env.VITE_BLOG_URL;

// Logging in and stuff 
function login(username, password){ 
    
    return cancellablePromise(
    fetch(`${BLOG_URL}/dashboard/login`, { method:'POST', mode: 'cors', credentials: 'include', body: JSON.stringify({username, password}), headers: {'Content-type': 'application/json'}})
    .then(res=> {
        if(res.ok) return res;
        return Promise.reject({status: res.status, statusText: res.statusText});
    })
    .catch(err=>Promise.reject({status: err.status, statusText: err.statusText}))
)}

function logout(){ return cancellablePromise(
    fetch(`${BLOG_URL}/dashboard/logout`, { method: 'POST', mode: 'cors', credentials: 'include'})
    .then(res=> {
        if(res.ok) return true;
        return Promise.reject({status: res.status, statusText: res.statusText});
    })
    .catch(err=>Promise.reject({status: err.status, statusText: err.statusText}))
)}

function checkLogin(){return cancellablePromise(
    fetch(`${BLOG_URL}/dashboard/`, { method: 'GET', mode: 'cors', credentials: 'include'})
    .then(res=> {
        if(res.ok) return true;
        if(res.status === 401) return false;
        return Promise.reject({status: res.status, statusText: res.statusText})
    })
    .catch(err=> Promise.reject({status: err.status, statusText: err.statusText}))
)}
//////////////////////////////////////////////////////////////////////////////////////////

// CRUD for posts 

function makePost({title, details}){
    return cancellablePromise(
    fetch(`${BLOG_URL}/blog/post`, { method:'POST', mode: 'cors', credentials: 'include', body: JSON.stringify({title, details}), headers: {'Content-type': 'application/json'}})
    .then(res=> {
        if(res.ok) return true;
        return Promise.reject({status: res.status, statusText: res.statusText});
    })
    .catch(err=>Promise.reject({status: err.status, statusText: err.statusText}))
)}

function getPost(pid){
    return cancellablePromise(
    fetch(`${BLOG_URL}/blog/post/${pid}`)
    .then(res=>{
        if (res.ok) return res.json();
        return Promise.reject({status: res.status, statusText: res.statusText});
    })
    .catch(err=>Promise.reject({status: err.status, statusText: err.statusText}))
)}

function updatePost({pid, title, details, ispublished}){return cancellablePromise(
    fetch(`${BLOG_URL}/blog/post/${pid}`, { method:'PUT', mode: 'cors', credentials: 'include', body: JSON.stringify({title, details, ispublished}), headers: {'Content-type': 'application/json'}})
    .then(res=> {
        if(res.ok) return true;
        return Promise.reject({status: res.status, statusText: res.statusText});
    })
    .catch(err=>Promise.reject({status: err.status, statusText: err.statusText}))
)}

function deletePost(pid){return cancellablePromise(
    fetch(`${BLOG_URL}/blog/post/${pid}`, { method:'DELETE', mode: 'cors', credentials: 'include'})
    .then(res=> {
        if(res.ok) return true;
        return Promise.reject({status: res.status, statusText: res.statusText});
    })
    .catch(err=>Promise.reject({status: err.status, statusText: err.statusText}))
)}

function getPosts({start = 0, limit = 10} = {}){
    console.log(BLOG_URL);
    return cancellablePromise(
    fetch(`${BLOG_URL}/blog/posts?start=${start}&limit=${limit}`, { method:'GET', credentials: 'include'})
    .then(res=> res.json())
    .catch(err=>Promise.reject({status: err.status, statusText: err.statusText}))
)}

////////////////////////////////////////////////////////////////////////////////////

// CRUD For Comments 

function getComments({pid}){
    return cancellablePromise(
    fetch(`${BLOG_URL}/blog/post/${pid}/comments`)
    .then(res=> res.json())
    .catch(err=>Promise.reject({status: err.status, statusText: err.statusText}))
)}

function getComment({pid, cid}){
    return cancellablePromise(
    fetch(`${BLOG_URL}/blog/post/${pid}/comment/${cid}`)
    .then(res=> res.json())
    .catch(err=>Promise.reject({status: err.status, statusText: err.statusText}))
)}

function deleteComment({pid,cid}){return cancellablePromise(
    fetch(`${BLOG_URL}/blog/post/${pid}/comment/${cid}`, { method:'DELETE', mode: 'cors', credentials: 'include'})
    .then(res=> res.json())
    .catch(err=>Promise.reject({status: err.status, statusText: err.statusText}))
)}

function makeComment({pid, name, details}){return cancellablePromise(
    fetch(`${BLOG_URL}/blog/post/${pid}/comment`, { method:'POST', mode: 'cors', credentials: 'include', body: JSON.stringify({name, details}), headers: {'Content-type': 'application/json'}})
    .then(res=> {
        if(res.ok) return res.json();
        return Promise.reject({status: res.status, statusText: res.statusText});
    })
    .catch(err=>Promise.reject({status: err.status, statusText: err.statusText}))
)}



export default {
    login,
    checkLogin,
    logout,
    makePost,
    getPost,
    updatePost,
    deletePost,
    getPosts,
    getComment,
    getComments,
    makeComment,
    deleteComment
}