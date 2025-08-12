import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";

export default function Contacts() {
  return (
    <>
      <Container className="mt-10">
        <Title text="Контакты" size="lg" className="font-extrabold" />
      </Container>

      <Container className="mt-10 pb-14">
        <div className="space-y-6">
          <p className="font-bold">Название компании: ООО «Fluttrium»</p>
          <p>
            ИНН: 1000014076 <br />
            КПП: 100001001 <br />
            ОГРН: 1241000000669 <br />
            ОКПО: 99276658
          </p>

          <p className="font-bold">Режим работы:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Пн с 10:00 до 20:00</li>
            <li>Вт с 10:00 до 20:00</li>
            <li>Ср с 10:00 до 20:00</li>
            <li>Чт с 10:00 до 20:00</li>
            <li>Пт с 10:00 до 20:00</li>
            <li>Сб с 10:00 до 20:00</li>
            <li>Вс с 10:00 до 20:00</li>
          </ul>

          <p className="font-bold">Телефон:</p>
          <p>+79214570057</p>

          <p className="font-bold">E-mail:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              По всем вопросам, связанными с ножами:
              <a href="mailto:info@daggerrknives.ru" className="font-bold">
                {" "}
                fluttrium@gmail.com
              </a>
            </li>
            <li>
              По вопросам сервисного обслуживания:
              <a href="mailto:fluttrium@gmail.com" className="font-bold">
                {" "}
                fluttrium@gmail.com
              </a>
            </li>
            <li>
              Для дилерского сотрудничества:
              <a href="mailto:fluttrium@gmail.com" className="font-bold">
                {" "}
                fluttrium@gmail.com
              </a>
            </li>
            <li>
              По вопросам сотрудничества:
              <a href="mailto:fluttrium@gmail.com" className="font-bold">
                {" "}
                fluttrium@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </Container>
    </>
  );
}
