import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'ResumeLens — AI Resume Checker',description:'Turn your experience into a stronger application. Resume analysis, job matching, and honest, actionable feedback.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
