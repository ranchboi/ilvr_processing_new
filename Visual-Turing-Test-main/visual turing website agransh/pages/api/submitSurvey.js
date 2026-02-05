// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
 
// import sanityClient from '@sanity/client'
import fs from 'fs';
import path from 'path';

// export const config = {
//  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
//  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
//  apiVersion: '2021-03-25',
//  useCdn: process.env.NODE_ENV === 'production',
//  token: process.env.SANITY_API_TOKEN,
// }
// 
// const client = sanityClient(config)
 
export default async function submitSurvey(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const data = JSON.parse(req.body);
  const filePath = path.join(process.cwd(), 'responses.json');
  let responses = [];
  if (fs.existsSync(filePath)) {
    responses = JSON.parse(fs.readFileSync(filePath));
  }
  responses.push(data);
  fs.writeFileSync(filePath, JSON.stringify(responses, null, 2));
  return res.status(200).json({ message: 'Response saved locally' });
}