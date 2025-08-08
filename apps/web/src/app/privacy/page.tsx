import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description:
    'Политика конфиденциальности интернет‑магазина Knife\'s Shop: какие данные мы собираем, как используем и как вы можете управлять ими.',
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Политика конфиденциальности</h1>
        <p className="text-gray-500">Действует с 08.08.2025</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Общие положения</h2>
        <p>
          Настоящая Политика конфиденциальности (далее — «Политика») регулирует порядок
          обработки и защиты персональных данных пользователей интернет‑магазина Knife&apos;s Shop
          (далее — «Сайт»).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Какие данные мы собираем</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Контактные данные: имя, e‑mail, телефон.</li>
          <li>Данные для доставки: адрес, индекс, получатель.</li>
          <li>Данные аккаунта: логин, хеш пароля.</li>
          <li>
            Технические данные: IP‑адрес, информация о браузере и устройстве, файлы cookie,
            данные о сессиях и действиях на Сайте.
          </li>
          <li>Данные об оплате (обрабатываются платёжными провайдерами).</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Цели обработки данных</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Регистрация и авторизация пользователя.</li>
          <li>Оформление, оплата и доставка заказов.</li>
          <li>Поддержка и коммуникация по обращениям.</li>
          <li>Улучшение работы Сайта и персонализация.</li>
          <li>Выполнение требований законодательства.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Cookies и tracking</h2>
        <p>
          Мы используем файлы cookie и аналогичные технологии для корректной работы Сайта,
          анализа трафика и персонализации. Вы можете изменить настройки cookie в браузере, но
          это может повлиять на функциональность.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">5. Хранение и защита данных</h2>
        <p>
          Данные хранятся в защищённых средах и обрабатываются с использованием современных
          методов защиты. Доступ ограничен уполномоченными лицами. Срок хранения зависит от
          целей обработки и требований закона.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">6. Передача третьим лицам</h2>
        <p>
          Мы можем передавать данные логистическим партнёрам, платёжным провайдерам,
          сервисам аналитики — исключительно для целей, указанных в Политике, и на основании
          договоров о конфиденциальности и обработке данных.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">7. Права пользователя</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Получать информацию об обработке своих данных.</li>
          <li>Запрашивать копию, исправление или удаление данных.</li>
          <li>Отозвать согласие и возражать против обработки.</li>
        </ul>
        <p>
          Для реализации прав свяжитесь с нами: <a className="text-blue-600 underline" href="mailto:support@knifes-shop.com">fluttrium@gmail.com</a>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">8. Изменения Политики</h2>
        <p>
          Мы можем обновлять Политику. Новая редакция вступает в силу с момента публикации на
          Сайте. Рекомендуем периодически просматривать эту страницу.
        </p>
      </section>

      <footer className="pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">Контакты: fluttrium@gmail.com</p>
      </footer>
    </main>
  );
}