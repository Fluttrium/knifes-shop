'use client';
import { Container } from "@/components/shared/container";
import Image from "next/image";
import Link from "next/link";

function BannerSliderCSS() {
    const banners = [
        { src: "/hui3.jpg", link: "https://t.me/knifes_spb" },
        { src: "/hui1.jpeg", link: "" },
        { src: "/hui2.jpeg", link: "" },
    ];
    const allBanners = [...banners, ...banners]; // Дублируем для бесконечной прокрутки

    return (
        <Container className="mt-10">
            <div className="overflow-hidden px-4 sm:px-0">
                <div className="flex gap-4 animate-scroll whitespace-nowrap">
                    {allBanners.map((banner, idx) => (
                        <Link
                            key={idx}
                            href={banner.link}
                            className="flex-shrink-0 w-[300px] sm:w-[calc(33.333%-1rem)] rounded-xl overflow-hidden shadow-lg border border-black/30 bg-white hover:scale-105 transition-transform duration-300"
                        >
                            <Image
                                src={banner.src}
                                alt={`Баннер ${idx + 1}`}
                                width={300}
                                height={192}
                                className="w-full h-48 object-contain"
                                unoptimized
                            />
                        </Link>
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
