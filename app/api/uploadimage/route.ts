import {v2 as cloudinary} from 'cloudinary';
import { addImageUrl } from '@/actions/wordactions';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET, 
});


export async function POST(request: Request) {
    const { id, imageUrl } = await request.json();
    console.log("in api: ", id, imageUrl);
    await cloudinary.uploader.upload(
        imageUrl,
        { public_id: id },
        async function (error, result) {
            if (error){
                console.log(error);
                return new Response(JSON.stringify(error), { status: 500 });
            }
            console.log(result);
            await addImageUrl(id, result!.url);
            return new Response(JSON.stringify(result), { status: 200 });
        }
    );
    return new Response(JSON.stringify({message : "upload succeed"}), { status: 200 });
}
