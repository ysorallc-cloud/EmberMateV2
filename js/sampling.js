const Sampling = {
  key: 'embermate_sampling',
  init(){
    if (!localStorage.getItem(this.key)){
      localStorage.setItem(this.key, JSON.stringify({ global:0.2, errors:1, vitals:0.3, longtask:0.2, keepDays:30 }));
    }
  },
  get(){ try{ return JSON.parse(localStorage.getItem(this.key)||'{}'); }catch{ return {} } },
  set(p){ localStorage.setItem(this.key, JSON.stringify({ ...this.get(), ...p })); },
  hit(kind){
    const p = this.get(); const g = Number(p.global ?? 1); const k = Number(p[kind] ?? g);
    return Math.random() < Math.min(1, Math.max(0, isFinite(k)? k : g));
  },
  keepMs(){ const d = Number(this.get().keepDays || 30); return d * 24*3600*1000; }
};
