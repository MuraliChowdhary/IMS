import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/Components/login-form"
import { imageUrl } from "@/config"

export default function LoginPage() {
     // Ensure this path is correct relative to the public folder 
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        PrimeMart
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            {/* --- Corrected Image Section --- */}
            <div className="bg-white relative hidden lg:flex items-center justify-center p-10">
                {/* The image is no longer a background, but a centered element */}

                
                <img
                    src={imageUrl}// This should be the path to your logo in the `public` folder
                    alt="PrimeMart Logo"
                    className="w-auto h-auto max-w-lg" // Controls the size of the logo
                />
            </div>
        </div>
        
    )
}
