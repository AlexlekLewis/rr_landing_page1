// @vitest-environment jsdom
import React from 'react';
import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {MemoryRouter,Routes,Route,Link} from 'react-router-dom';
const m=vi.hoisted(()=>({locked:false,clear:vi.fn()}));
vi.mock('./renewal-memory',()=>({renewalMemory:{locked:()=>m.locked,clear:m.clear}}));
import RenewalPrivacyBoundary from './RenewalPrivacyBoundary';
afterEach(()=>{cleanup();m.locked=false;m.clear.mockClear();});
function draw(){render(<MemoryRouter initialEntries={['/book/renewal']}><RenewalPrivacyBoundary><Routes><Route path="/book/renewal" element={<><h1>Renewal</h1><Link to="/">Leave</Link></>}/><Route path="/" element={<h1>Public page</h1>}/></Routes></RenewalPrivacyBoundary></MemoryRouter>);}
it('clears the renewal namespace when a known operation leaves the private route',()=>{draw();fireEvent.click(screen.getByRole('link',{name:'Leave'}));expect(screen.getByRole('heading',{name:'Public page'})).toBeTruthy();expect(m.clear).toHaveBeenCalledTimes(1);});
it('keeps a locked original operation on its route without clearing memory or reloading',()=>{m.locked=true;draw();fireEvent.click(screen.getByRole('link',{name:'Leave'}));expect(screen.getByRole('heading',{name:'Renewal'})).toBeTruthy();expect(screen.queryByRole('heading',{name:'Public page'})).toBeNull();expect(m.clear).not.toHaveBeenCalled();});
