import React,{useLayoutEffect,useEffect} from 'react';
import {useLocation,useNavigate} from 'react-router-dom';
import {amendmentMemory} from './amendment-memory';
export default function AmendmentPrivacyBoundary({children}){const {pathname}=useLocation(),navigate=useNavigate();useLayoutEffect(()=>{if(/^\/book\/amendment(?:\/|$)/i.test(pathname))return;if(amendmentMemory.locked()){navigate('/book/amendment',{replace:true});return;}amendmentMemory.clear();},[pathname,navigate]);useEffect(()=>{const clear=()=>amendmentMemory.clear();window.addEventListener('pagehide',clear);return()=>window.removeEventListener('pagehide',clear);},[]);return children;}
