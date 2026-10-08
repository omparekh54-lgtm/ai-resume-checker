import {NextRequest,NextResponse} from 'next/server';
import mammoth from 'mammoth';
import pdf from 'pdf-parse/lib/pdf-parse.js';
export const runtime='nodejs';
export const maxDuration=30;
export async function POST(req:NextRequest){
 try{
  if(req.headers.get('origin')&&new URL(req.headers.get('origin')!).host!==req.nextUrl.host)return NextResponse.json({error:'Use the upload form on this website.'},{status:403});
  if(Number(req.headers.get('content-length'))>3500000)return NextResponse.json({error:'Upload a file smaller than 3 MB.'},{status:413});
  const form=await req.formData();const file=form.get('file');
  if(!(file instanceof File)||file.size>3000000||!file.size)return NextResponse.json({error:'Choose a non-empty PDF, DOCX or TXT under 3 MB.'},{status:400});
  const buf=Buffer.from(await file.arrayBuffer());const ext=file.name.split('.').pop()?.toLowerCase();let value='';
  if(ext==='pdf'){if(buf.subarray(0,5).toString()!=='%PDF-')throw Error();const result=await pdf(buf,{max:10});if(result.numpages>10)return NextResponse.json({error:'Please upload a resume with no more than 10 pages.'},{status:400});value=result.text;}
  else if(ext==='docx'){if(buf.subarray(0,2).toString()!=='PK')throw Error();value=(await mammoth.extractRawText({buffer:buf})).value;}
  else if(ext==='txt')value=buf.toString('utf8');else return NextResponse.json({error:'Supported formats: PDF, DOCX and TXT.'},{status:400});
  value=value.replace(/\u0000/g,'').trim();if(value.length<100)return NextResponse.json({error:'Not enough readable text. For scanned PDFs, copy the text into the editor or upload a text-based file.'},{status:422});
  if(value.length>24000)return NextResponse.json({error:'This document is too long. Paste the relevant resume text (up to 24,000 characters).'}, {status:400});
  return NextResponse.json({text:value,name:file.name},{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'Could not read this file. Try a text-based PDF, a DOCX, or paste your resume.'},{status:400})}
}
