'use client';
import { Container } from "@/components/shared/container";
import Image from "next/image";

function BannerSliderCSS() {
    const banners = [
        "/hui3.jpg",
        "/hui1.jpeg",
        "/hui2.jpeg",
    ];
    const allBanners = [...banners, ...banners];

    return (
        <Container className="mt-10">
            <div className="overflow-hidden px-4 sm:px-0">
                <div className="flex gap-4 animate-scroll whitespace-nowrap">
                    {allBanners.map((src, idx) => (
                        <div
                            key={idx}
                            className="flex-shrink-0 w-[300px] sm:w-[calc(33.333%-1rem)] rounded-xl overflow-hidden shadow-lg border border-black/30 bg-white"
                        >
                            <Image
                                src={src}
                                alt={`Баннер ${idx + 1}`}
                                width={300}
                                height={192}
                                className="w-full h-48 object-contain"
                                unoptimized
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        :global(.animate-scroll) {
          display: flex;
          animation: scroll 20s linear infinite;
        }
      `}</style>
        </Container>
    );
}

export default BannerSliderCSS;
