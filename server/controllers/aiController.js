import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import { response } from "express";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from 'pdf-parse/lib/pdf-parse.js';


const AI = new OpenAI({
    apiKey: "process.env.GEMINI_API_KEY",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async () => {
    try {
        const { userId } = req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;
        // const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" })
        }

        const formData = new FormData();
        form.append('prompt', prompt);

       const {data} = await axios.post("https://clipdrop-api.co/text-to-image/v1",formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY
            },
            responseType: 'arraybuffer',
        })

        const base64Image = `data:image/png;base64,${Buffer.from(data,'binary').toString('base64')}`;

        const {secure_url} = await cloudinary.uploader.upload(base64Image)

        await sql` INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false }) `;

        res.json({success:true, content:secure_url})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;
        // const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" })
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: `Generate a blog title for the following topic: ${prompt}`
                }
            ],
            max_tokens: 100,
            temperature: 0.7,
        });

        const title = response.choices[0].message.content;

        await sql` INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${title}, 'blog-title', ${publish ?? false }) `;

        res.json({success:true, content:title})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

export const generateImage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;
        // const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" })
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: `Generate an image for the following description: ${prompt}`
                }
            ],
            max_tokens: 100,
            temperature: 0.7,
        });

        const imageUrl = response.choices[0].message.content;

        await sql` INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${imageUrl}, 'image', ${publish ?? false }) `;

        res.json({success:true, content:imageUrl})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}   

export const removeImageBackground = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { image } = req.body;
        const plan = req.plan;

        if(plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" });
        }
    
        const { secure_url } = await cloudinary.uploader.upload(image.path,{
            transformation: [
                { effect: "background_removal" },
                { background_removal: "remove_the_background" }
            ]
        });

        await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, prompt, content, type, publish) values (${userId}, 'Remove background from image', ${secure_url}, 'image', ${publish ?? false}) `;

        res.json({ success: true, content: secure_url });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }   
}

export const removeImageObject = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { object } = req.body;
        const { image } = req.body;
        const plan = req.plan;

        if(plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" });
        }
    
        const { public_id } = await cloudinary.uploader.upload(image.path)

       const imageUrl =  cloudinary.url(public_id, {
            transformation: [{effect: `gen_remove:${object}`}],
            resource_type: 'image'
        })

        await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, prompt, content, type, publish) values (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image') `;

        res.json({ success: true, content: imageUrl });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }   
}
export const resumeReview = async (req, res) => {
    try {
        const { userId } = req.auth();
        const resume = req.file;
        const plan = req.plan;

        if(plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" });
        }
    
        if(resume.size > 5 * 1024 * 1024) { // 5MB limit
            return res.json({ success: false, message: "Resume file size exceeds 5MB" });
        }

        const dataBuffer = fs.readFileSync(resume.path);
        const pdfData = await pdf(dataBuffer);

        const prompt = `Review this resume and provide constructive feedback on its strengts, weaknesses, and areas for improvement. The resume content is as follows:\n\n ${pdfData.text}`;

         const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                }
            ],
            max_tokens: 1000,
            temperature: 0.7,
        });
        const content = response.choices[0].message.content;

        await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, prompt, content, type, publish) values (${userId},'Review the uploaded resume', ${content}, 'resume-review') `;

        res.json({ success: true, content });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }   
}