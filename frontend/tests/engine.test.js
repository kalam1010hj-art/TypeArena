import test from 'node:test';
import assert from 'node:assert/strict';
import {Session,letters} from '../src/engine.js';
test('clock starts on input and caps at deadline before accepting a late key',()=>{
 const s=new Session('one two',15);s.tick(3500);assert.equal(s.time(3500),0);s.edit('o',4000);s.edit('on',25000);assert.equal(s.input.join(''),'o');assert.equal(s.time(26000),15000);assert.ok(s.done);
});
test('corrections retain attempted keys and accuracy',()=>{
 const s=new Session('abcde',60);s.edit('x',0);s.edit('',100);s.edit('abcde',12000);const m=s.stats(17000);assert.deepEqual([m.net,m.raw,m.gross,m.accuracy,m.correct,m.incorrect],[5,6,5,83,5,0]);assert.ok(s.done);
});
test('blur excludes inactive time and restart clears all state',()=>{
 const s=new Session('text',15);s.edit('t',0);s.pause(2000);s.tick(42000);s.resume(43000);assert.equal(s.time(44000),3000);assert.equal(new Session('text',15).attempts,0);
});
test('composed Unicode graphemes and incorrect final input',()=>{
 assert.equal(letters('e\u0301').length,1);const s=new Session('éకా',15);s.edit('e\u0301',100);s.edit('éx',2100);assert.equal(s.stats(4400).incorrect,1);assert.equal(s.errors['కా'],1);assert.ok(s.done);
});
