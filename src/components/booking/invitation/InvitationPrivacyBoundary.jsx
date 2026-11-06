import React,{useLayoutEffect,useEffect} from 'react';
import {useLocation,useNavigate} from 'react-router-dom';
import {invitationMemory} from './invitation-memory';
export default function InvitationPrivacyBoundary({children}){
 const {pathname}=useLocation(),navigate=useNavigate();
 useLayoutEffect(()=>{if(/^\/book\/invitation(?:\/|$)/i.test(pathname))return;if(invitationMemory.locked()){navigate('/book/invitation',{replace:true});return;}invitationMemory.clear();},[pathname,navigate]);
 useEffect(()=>{const clear=()=>invitationMemory.clear();window.addEventListener('pagehide',clear);return()=>window.removeEventListener('pagehide',clear);},[]);
 return children;
}
