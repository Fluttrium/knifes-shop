import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Пользовательское соглашение",
  description:
    "Условия использования интернет‑магазина Knife's Shop: права и обязанности сторон, оформлением заказов и ответственность.",
};

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Пользовательское соглашение</h1>
        <p className="text-gray-500">Действует с 08.08.2025</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Термины и общие положения</h2>
        <p>
          Настоящее Пользовательское соглашение (далее — «Соглашение»)
          регулирует отношения между владельцем интернет‑магазина Knife&apos;s
          Shop (далее — «Продавец») и пользователем Сайта (далее —
          «Покупатель»).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Регистрация и аккаунт</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Покупатель предоставляет достоверные данные при регистрации.</li>
          <li>
            Ответственность за сохранность учётных данных несёт Покупатель.
          </li>
          <li>Продавец может ограничить доступ при нарушениях Соглашения.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Заказ и оплата</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Заказ оформляется через интерфейс Сайта.</li>
          <li>
            Оплата производится через платёжных провайдеров, указанных на Сайте.
          </li>
          <li>
            Цены указаны в карточках товаров и могут быть изменены до оформления
            заказа.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Доставка</h2>
        <p>
          Сроки и стоимость доставки зависят от выбранного способа и региона.
          Риск случайной гибели или повреждения товара переходит Покупателю в
          момент передачи заказа перевозчику, если иное не предусмотрено
          законом.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">5. Возврат и гарантия</h2>
        <p>
          Возврат осуществляется в соответствии с законодательством и политикой
          возврата, опубликованной на Сайте. Сроки гарантии указываются в
          описании товара.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">6. Ответственность</h2>
        <p>
          Продавец не несёт ответственность за перерывы в работе Сайта
          вследствие действий третьих лиц, форс‑мажора и регламентных работ.
          Ответственность за корректность предоставленных данных несёт
          Покупатель.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          7. Интеллектуальная собственность
        </h2>
        <p>
          Все материалы на Сайте защищены. Копирование и использование
          допускаются только с согласия правообладателя, за исключением случаев,
          прямо разрешённых законом.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">8. Персональные данные</h2>
        <p>
          Обработка персональных данных осуществляется в соответствии с нашей
          Политикой конфиденциальности. Используя Сайт, вы подтверждаете
          ознакомление с Политикой и согласие на обработку данных.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">9. Изменения Соглашения</h2>
        <p>
          Мы можем обновлять Соглашение. Новая редакция вступает в силу с
          момента публикации на Сайте. Рекомендуем периодически просматривать
          эту страницу.
        </p>
      </section>

      <footer className="pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          По вопросам: fluttrium@gmail.com
        </p>
      </footer>
    </main>
  );
}
