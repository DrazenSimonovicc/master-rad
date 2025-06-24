import { FC } from "react";
import styles from "./Footer.module.scss";
import Image from "next/image";
import footerImage from "@/Assets/footerImages/img7.jpg";
import { useFetchFooter } from "@/Hooks/getFooterData";
import { Button } from "@/Components/Button";
import TextInput from "@/Components/Inputs/TextInput/TextInput";
import Link from "next/link";

//ToDo: treba srediti dizajn da izgleda pristojno
export const Footer: FC = () => {
  const { footerData, error, loading } = useFetchFooter();

  if (loading) return <div>loading...</div>;
  if (error) return <div>error: {error}</div>;

  const data = footerData?.[0];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerDataWrap}>
          <div className={styles.footerPart}>
            <div className={styles.footerHeader}>Podaci o studentu:</div>
            <div>
              <Link href={"/drazen-simonovic"}>
                {data?.expand?.personal?.first_name}{" "}
                {data?.expand?.personal?.last_name}
              </Link>
            </div>
            <p>{data?.expand.personal.title}</p>
            <p>{data?.expand?.personal?.index_number}</p>
          </div>

          <div className={styles.footerPart}>
            <div className={styles.footerHeader}>Podaci o predmetu:</div>
            <p>{data?.subject}</p>
            <p>{data?.theme}</p>
          </div>

          <div className={styles.footerPart}>
            <div className={styles.footerHeader}>Podaci o fakultetu:</div>
            <p>{data?.expand?.faculty?.faculty_name}</p>
            <p>{data?.expand?.faculty?.university_name}</p>
            <p>{data?.expand?.faculty?.address}</p>
            <div>
              {data?.expand?.faculty?.postal_code} {data?.expand?.faculty?.city}
            </div>
          </div>
        </div>

        {/*<div className={styles.subscribeContent}>
          <span className={styles.subscribeDescription}>
            Prijavite se na novosti
          </span>
          <div className={styles.subscribeWrap}>
            <div className={styles.subscribeInput}>
              <TextInput
                type={"text"}
                placeholder={"Vaša email adresa"}
                onChange={() => {
                  console.log("a");
                }}
              />
            </div>
            <Button
              title={"Prijavite se"}
              themes={["blue", "standardHeight", "standardWide"]}
            />
          </div>
        </div>*/}

        <p className={styles.rights}>
          © 2025 Dražen Simonović. Sva prava sačuvana.
        </p>
      </div>
      <div className={styles.footerImage}>
        <Image src={footerImage} width={1200} height={300} alt="Footer image" />
      </div>
    </footer>
  );
};
