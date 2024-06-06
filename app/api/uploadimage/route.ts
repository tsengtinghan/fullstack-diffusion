import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dpwxjh6b5', 
  api_key: '183124557118962', 
  api_secret: 'YXpHnDK8S1yJBjR3-IAoMhsjDdc' 
});

// need to put these in env variables

export async function POST(request: Request) {
  cloudinary.uploader.upload(
    "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
    { public_id: "olympic_flag" },
    function (error, result) {
      if (error){
        console.log(error);
        return new Response(JSON.stringify(error), { status: 500 });
      }
      console.log(result);
      // add url to db
      return new Response(JSON.stringify(result), { status: 200 });
    }
  );

}
