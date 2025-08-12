import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";

export default function Collaboration() {
  return (
    <>
      <Container className="mt-10">
        <Title
          text="Сотрудничество с блогерами"
          size="lg"
          className="font-extrabold"
        />
      </Container>

      <Container className="mt-10 pb-14">
        <div className="space-y-6">
          <p className="font-bold">
            Компания Ножи СПБ открыта к сотрудничеству с блогерами!
          </p>
          <p>
            Если у Вас есть блог в любой социальной сети, который связан с
            тематикой туризма, ножевой культуры, активного отдыха или вы
            освещаете другие смежные темы, то мы будем рады поработать с вами на
            интересных и для вас, и для нас условиях!
          </p>

          <p className="font-bold">Как с нами связаться?</p>
          <p>
            Напишите письмо на нашу почту
            <a href="mailto:fluttrium@gmail.com" className="font-bold">
              {" "}
              fluttrium@gmail.com{" "}
            </a>
            с темой письма «Блогер для Ножи СПБ». Расскажите немного о себе, о
            чем рассказываете в блоге и какой контент публикуете, есть ли у вас
            идеи как представить наш бренд. Приложите к письму ссылки на ваши
            социальные сети, а также скриншоты со статистикой.
          </p>

          <p>
            Наша команда рассмотрит ваше письмо и обязательно вернется с
            ответом!
          </p>
        </div>
      </Container>
    </>
  );
}
