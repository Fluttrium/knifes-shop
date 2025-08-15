import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const Footer: React.FC = () => {
  return (
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Компания */}
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Image src="/logo1.png" alt="Logo" width={30} height={30} />
                <div>
                  <h3 className="text-lg font-semibold">Ножи СПБ</h3>
                  <p className="text-xs text-gray-400">Доставка по РФ</p>
                </div>
              </Link>
              <p className="text-gray-300 mb-4">
                Качественные ножи и кухонные принадлежности с бесплатной доставкой по России
              </p>
              <div className="flex space-x-3">
                {/* ВК */}
                <a
                    href="https://vk.com/club232150298"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="VK"
                    className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.863-.525-2.049-1.714-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.594v1.563c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.594-.491h1.744c.441 0 .61.203.78.678.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.271.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.254.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z" />
                  </svg>
                </a>
                {/* Telegram */}
                <a
                    href="https://t.me/knifes_spb"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Telegram"
                    className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                    href="https://instagram.com/knives_spb_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm8.75 2a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Способы оплаты */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Способы оплаты</h3>
              <Image
                  src="/ic_visa_mastercard_mir.png"
                  alt="Способы оплаты: Visa, MasterCard, МИР"
                  width={200}
                  height={40}
                  className="object-cover"
              />
            </div>

            {/* Информация */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Информация</h3>
              <ul className="space-y-2">
                <li><Link href="/company" className="text-gray-300 hover:text-white transition-colors">О компании</Link></li>
                <li><Link href="/delivery" className="text-gray-300 hover:text-white transition-colors">Доставка и оплата</Link></li>
                <li><Link href="/garanty" className="text-gray-300 hover:text-white transition-colors">Гарантия</Link></li>
                <li><Link href="/contacts" className="text-gray-300 hover:text-white transition-colors">Контакты</Link></li>
              </ul>
            </div>

            {/* Контакты */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Контакты</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3"><Phone className="w-4 h-4 text-gray-400" /><span className="text-gray-300">+79214570057</span></div>
                <div className="flex items-center space-x-3"><Mail className="w-4 h-4 text-gray-400" /><span className="text-gray-300">fluttrium@gmail.com</span></div>
                <div className="flex items-center space-x-3"><MapPin className="w-4 h-4 text-gray-400" /><span className="text-gray-300">Санкт-Петербург</span></div>
                <div className="flex items-center space-x-3"><Clock className="w-4 h-4 text-gray-400" /><span className="text-gray-300">Пн-Пт: 9:00-18:00</span></div>
              </div>
            </div>
          </div>

          {/* Нижняя часть */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© 2024 Ножи СПБ. Все права защищены.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Политика конфиденциальности</Link>
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Пользовательское соглашение</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
  );
};
