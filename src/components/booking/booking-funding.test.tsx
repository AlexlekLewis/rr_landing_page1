// @vitest-environment jsdom
import React from 'react';
import {afterEach,it,expect} from 'vitest';
import {cleanup,render,screen} from '@testing-library/react';
import {parsePrice} from './booking-model';
import {parseRequest} from './public-client';
import BookingStatus from './BookingStatus';
const price={per_session_cents:13000,sessions:1,discount_applied:false,first_session_hold_cents:13000,rest_cents:0,total_cents:13000};
const result={request_id:'00000000-0000-4000-8000-000000987301',state:'requested',server_now:'2026-11-09T09:00:00+11:00',expires_at:null,expires_in_seconds:1800,dates:[{date:'2026-11-11',starts_at:'2026-11-11T16:00:00+11:00',ends_at:'2026-11-11T17:00:00+11:00'}],price,checkout_state:'closed'};
afterEach(cleanup);
it('accepts request-only credit arithmetic while keeping public availability quotes separate',()=>{
 const p={...price,first_session_hold_cents:1300,credit_reserved_cents:11700,funding_mode:'card'};
 expect(parseRequest({ok:true,request:{...result,funding_mode:'card',price:p}}).price).toMatchObject(p);
 expect(()=>parsePrice(p)).toThrow();expect(()=>parseRequest({ok:true,request:{...result,price:{...p,credit_reserved_cents:1}}})).toThrow();
});
it('rejects top-level funding claims that have no matching quote proof',()=>expect(()=>parseRequest({ok:true,request:{...result,funding_mode:'covered'}})).toThrow());
it('does not prompt for a card in the staff recorded-payment reservation',()=>{
 render(<BookingStatus initial={parseRequest({ok:true,request:{...result,state:'checkout',funding_mode:'recorded'}})} checkpoint={null} onNew={()=>{}}/>);
 expect(screen.getByRole('heading',{name:'The Academy is checking your booking'})).toBeTruthy();expect(screen.queryByText(/Finish your card hold/)).toBeNull();
});
it('shows reserved credit without claiming a card hold exists',()=>{
 const r=parseRequest({ok:true,request:{...result,funding_mode:'covered',price:{...price,first_session_hold_cents:0,credit_reserved_cents:13000,funding_mode:'covered'}}});
 render(<BookingStatus initial={r} checkpoint={null} onNew={()=>{}}/>);
 expect(screen.getByText(/Your credit is reserved/)).toBeTruthy();expect(screen.queryByText(/Your card hold is in place/)).toBeNull();
});
it('describes setup and the remaining amount without a fake zero card hold',()=>{
 const r=parseRequest({ok:true,request:{...result,state:'checkout',checkout_state:'ready',funding_mode:'setup',dates:[...result.dates,{date:'2026-11-18',starts_at:'2026-11-18T16:00:00+11:00',ends_at:'2026-11-18T17:00:00+11:00'}],price:{...price,sessions:2,total_cents:26000,first_session_hold_cents:0,rest_cents:13000,credit_reserved_cents:13000,funding_mode:'setup'},checkout_url:'https://checkout.stripe.com/c/pay/cs_test_Funding'}});
 render(<BookingStatus initial={r} checkpoint={null} onNew={()=>{}}/>);
 expect(screen.getByRole('heading',{name:'Finish saving your card'})).toBeTruthy();expect(screen.getByText(/No first-session card hold is needed/)).toBeTruthy();expect(screen.getByRole('link',{name:'Continue to secure card setup'})).toBeTruthy();
});
