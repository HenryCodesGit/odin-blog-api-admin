import "./App.css";

import { useEffect, useState, useCallback, useRef } from "react";

import Stackedit from "stackedit-js";

import blogAPI from "./Blog/blogAPI";

function App() {

  const [loggedIn, setLoggedIn] = useState();
  const [posts, setPosts] = useState();
  const modalRef = useRef();
  const titleRef = useRef();
  const textAreaRef = useRef();
  const hiddenRef = useRef();

  const [editor] = useState(new Stackedit());

  
  const checkLogin = useCallback(()=>{
    const [responseCheck, cancelCheck] = blogAPI.checkLogin()
    responseCheck
      .then(setLoggedIn)
      .catch((err)=>console.warn('Something went wrong when checking login', err)); //TODO: Error page
    return {cancelCheck};
  },[])

  function login(event){
    event.preventDefault();
    const form = event.target;

    const username = new FormData(form).get("username");
    const password = new FormData(form).get("password");

    const [response] = blogAPI.login(username,password);
    response
      .then(checkLogin)
      .catch(err=>console.warn('Something went wrong during login',err));  //TODO: Error page
  }
  
  function logout(){
    const [response] = blogAPI.logout();
    response
    .then(checkLogin)
    .catch(err =>console.warn('Something went wrong with logout',err));  //TODO: Error page
  }

  function togglePublished(pid, ispublished){
    const [response] = blogAPI.updatePost({pid, ispublished: !ispublished})
    response
      .then(()=>{
        // Update locally the status of the post instead of re-fetching from database
        const newPosts = posts.map((post)=>{
          return (post.pid === pid) ? {...post, ispublished: !post.ispublished} : post
        });

        setPosts(newPosts)
      })
      .catch((err)=>console.log('Error toggling published status', err))  //TODO: Error page

  }

  function deletePost(pid, title){
    const confirm = window.prompt(`Are you sure you want to delete '${title}'? If so, type in the pid of this post: ${pid}`);
    
    if(confirm.toString() !== pid.toString()) return alert('Deletion cancelled');

    const [response] = blogAPI.deletePost(pid);
    response 
      .then(()=>{
        // Update locally the status of the post deltion instead of re-fetching from database
        const newPosts = posts.filter(post=>post.pid !== pid);
        setPosts(newPosts);
      })
      .catch((err)=>console.warn('Something went wrong with delete',err))

  }

  function showForm({title, details, pid}){
    if(title) titleRef.current.value = title;
    if(details) textAreaRef.current.value = details;
    if(pid) hiddenRef.current.value = pid;

    modalRef.current.showModal();
  }

  function showEditor(){
    // Open stackedit-js
    editor.openFile({ content: { text: textAreaRef.current.value }});
    // Listen to StackEdit events and apply the changes to the textarea
    editor.on('fileChange', file => textAreaRef.current.value = file.content.text);
    // Closing editor returns it to modal page
    editor.on('close', ()=> modalRef.current.showModal())
  }

  function makePost(event){
    event.preventDefault();

    //Get details
    const form =  new FormData(event.target);
    const title = form.get("title");
    const pid = form.get("pid");
    const details = form.get("details");

    const verify = window.confirm(`[PID: ${pid}]Are you sure you want to submit?`);
    if(!verify) return;

    //Update or create post depending on if PID is supplied1
    const [response] = (!pid) ? blogAPI.makePost({title, details}) : blogAPI.updatePost({pid, title, details});
    response
      .then((res)=>{
        if(!res) throw new Error('There was an error with creating/updating the post');
        closeFormAndClear();
      })
      .catch((err)=>{console.log('There was an error with creating/updating the post',err)});
  }

  function closeFormAndClear(){

    // Probably not needed because window is reloaded anyway, but whatever
    modalRef.current.close();
    titleRef.current.value = '';
    textAreaRef.current.value = '';
    hiddenRef.current.value = '';
    
    //Reload the window;
    window.location.reload();
  }

  function editPost(pid){
    const [response] = blogAPI.getPost(pid);
    response
      .then((data)=>showForm(data.details))
      .catch((err)=>{console.log('Something went wrong',err)});
  }
  
  // Check if logged in when page is loaded.
  useEffect(()=>{
    const {cancelCheck} = checkLogin();
    return ()=>cancelCheck();
  },[checkLogin]);

  // Once logged in, get all posts in the blog
  useEffect(()=>{
    if(!loggedIn) return setPosts(null);

    // Get EVERY post
    const [response, cancelGetPosts] = blogAPI.getPosts({start:0, limit: Number.MAX_SAFE_INTEGER})
    response
      .then(res=> setPosts(res.details))
      .catch(err=>console.warn('There was an issue getting posts',err));

    return ()=>{
      cancelGetPosts();
    }
  },[loggedIn])

  // Create Post Button
  const loginComponent = (loggedIn) ? 
    (<div className='login'>
      <button onClick={logout}>Logout</button>
    </div>) : 
    (<>
      <form method="POST" onSubmit={login}>
        <label>
          Username:
          <input type="text" id="username" name="username" />
        </label>
        <label>
          Password:
          <input type="password" id="password" name="password" />
        </label>
        <button type="submit">Submit</button>
      </form>
    </>);

  const postComponent = (!posts) ? null : 
      (<>
        <table>
          <thead>
            <tr>
              <th>PID</th>
              <th>Title</th>
              <th>Created</th>
              <th>Updated</th>
              <th>isPublished</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(({pid,title,created_at,updated_at,ispublished}) => {
              return (<tr key={pid}>
                <td>{pid}</td>
                <td>{title}</td>
                <td>{created_at}</td>
                <td>{updated_at}</td>
                <td><button onClick={()=>togglePublished(pid, ispublished)}>{ispublished.toString()}</button></td>
                <td className='optionsColumn'>
                  <button onClick={()=>deletePost(pid, title)}>Delete</button>
                  <button onClick={()=>editPost(pid)}>Edit</button>
                </td>
              </tr>)
            })}
          </tbody>
        </table>
      </>);

  const modalComponent = (!posts) ? null :
    (
      <div>
        <button onClick={showForm}>Create Post</button>
        <dialog ref={modalRef} className='modal'>
          <div className='modalContainer'>
            <form method="POST" onSubmit={makePost} className='modalForm'>
              <label>
                <h1>Title</h1>
                <input type="text" id="title" name="title" ref={titleRef} placeholder="Enter a title here"/>
              </label>
              <label className='textAreaLabel'>
                <h1>Details</h1>
                <textarea name="details" id="details" ref={textAreaRef} onFocus={()=>{
                  modalRef.current.close();
                  showEditor();
                }}></textarea>
              </label>
              <div className='buttonContainer'>
                <button type="submit">Submit</button>
                <button type="button" onClick={closeFormAndClear}>Cancel</button>
              </div>
              <input type="hidden" name="pid" id="pid" value='' ref={hiddenRef} />
            </form>
          </div>
        </dialog>
      </div>
    )

  //Otherwise return login form
  return (<>
    {loginComponent}
    {modalComponent}
    {postComponent}
  </>);
}

export default App;
