const segmenter = new Intl.Segmenter(undefined, {granularity: 'grapheme'});
export const letters = text => Array.from(segmenter.segment(text.normalize('NFC')), part => part.segment);
export const durations = [15,30,60,120,300,600];
export class Session {
  constructor(text, seconds) {
    this.target = letters(text);
    this.limit = seconds * 1000;
    this.input = [];
    this.attempts = 0;
    this.errors = {};
    this.hits = 0;
    this.elapsed = 0;
    this.since = null;
    this.done = false;
    this.samples = [];
  }
  time(now) { return Math.min(this.limit, this.elapsed + (this.since === null ? 0 : now-this.since)); }
  pause(now) { this.tick(now); this.elapsed = this.time(now); this.since = null; }
  resume(now) { if (this.attempts && !this.done && this.since === null) this.since = now; }
  edit(text, now) {
    this.tick(now);
    if (this.done) return;
    const next = letters(text).slice(0,this.target.length);
    let common = 0;
    while (common < next.length && next[common] === this.input[common]) common++;
    if (this.since === null && next.length) this.since = now;
    for (let i=common; i<next.length; i++) {
      this.attempts++;
      if (next[i] === this.target[i]) this.hits++;
      else this.errors[this.target[i]] = (this.errors[this.target[i]] || 0) + 1;
    }
    this.input = next;
    if (next.length === this.target.length) this.finish(now);
  }
  stats(now) {
    const ms = this.time(now);
    const correct = this.input.filter((c,i)=>c===this.target[i]).length;
    const speed = count => ms ? Math.round(count * 12000 / ms) : 0;
    const rates = this.samples.map(s=>s.rate);
    const mean = rates.reduce((a,b)=>a+b,0)/(rates.length || 1);
    const deviation = Math.sqrt(rates.reduce((a,b)=>a+(b-mean)**2,0)/(rates.length || 1));
    return {net:speed(correct),gross:speed(this.input.length),raw:speed(this.attempts),accuracy:this.attempts?Math.round(100*this.hits/this.attempts):100,correct,incorrect:this.input.length-correct,total:this.attempts,ms,consistency:rates.length>1 && mean ? Math.max(0,Math.round(100*(1-deviation/mean))):null};
  }
  sample(now) {
    const prev = this.samples.at(-1);
    const s = this.stats(now);
    if (s.ms <= (prev?.ms || 0)) return;
    this.samples.push({ms:s.ms,net:s.net,accuracy:s.accuracy,total:s.total,rate:(s.total-(prev?.total || 0))*12000/(s.ms-(prev?.ms || 0))});
  }
  tick(now) {
    if (this.done || this.since === null) return;
    if (this.time(now)>=this.limit) this.finish(now);
    else if (this.time(now)-(this.samples.at(-1)?.ms || 0)>=1000) this.sample(now);
  }
  finish(now) { this.sample(now); this.elapsed=this.time(now); this.since=null; this.done=true; }
}
