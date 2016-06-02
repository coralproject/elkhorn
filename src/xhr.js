
export default (url,method,post,cb,contenttype) => {
  let xhr
  try{ xhr = new XMLHttpRequest() } catch(e) {
  try{ xhr = new ActiveXObject('Msxml2.XMLHTTP') } catch (e) {
    return null
  }}

  const requestTimeout = setTimeout(() => {
    xhr.abort()
    cb(new Error('xhr: aborted by a timeout'), '',xhr)
  }, 10000);

  xhr.onreadystatechange = () => {
    if (xhr.readyState != 4) return
    clearTimeout(requestTimeout)
    cb(xhr.status != 200 ?
      new Error(`xhr: server respnse status is${xhr.status}`) : false,
      xhr.responseText,
      xhr);
  }

  xhr.open(method ? method.toUpperCase() : 'GET', url, true);
  xhr.withCredentials = true;

  if(post) {
    xhr.setRequestHeader('Content-type', contenttype ? contenttype : 'application/json');
    xhr.send(post)
 } else {
   xhr.send();
 }
}
