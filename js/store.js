function initStore(app){
  let data=null; try{ data = JSON.parse(localStorage.getItem('embermate_store') || 'null'); }catch{}
  if (!data || typeof data !== 'object' || !Array.isArray(data.rows)){
    data = { version: 3, locale: navigator.language || 'en-US', units: 'imperial', rows: [] };
    localStorage.setItem('embermate_store', JSON.stringify(data));
  }
  app.state.data = data;
  app.state.persist = ()=> localStorage.setItem('embermate_store', JSON.stringify(app.state.data));
}
