import footerImage from "@/Assets/footerImages/img7.jpg";
import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram, LinkedIn, Email, Phone, LocationOn } from "@mui/icons-material";
import { footerConfig } from "@/config/footerConfig";
import styles from "./Footer.module.scss";

export const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerDataWrap}>
          {/* Main Pages */}
          <div className={styles.footerPart}>
            <div className={styles.footerHeader}>Glavne stranice</div>
            <div className={styles.footerLinks}>
              {footerConfig.quickLinks.map((link) => (
                <Link key={link.href} href={link.href} className={styles.footerLink}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Resursi za nastavu */}
          <div className={styles.footerPart}>
            <div className={styles.footerHeader}>Resursi za nastavu</div>
            <div className={styles.footerLinks}>
              {footerConfig.resourceLinks.map((link) => (
                <Link key={link.href} href={link.href} className={styles.footerLink}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className={styles.footerPart}>
            <div className={styles.footerHeader}>Kontakt</div>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Email className={styles.contactIcon} />
                <a href={`mailto:${footerConfig.contact.email}`} className={styles.contactLink}>
                  {footerConfig.contact.email}
                </a>
              </div>
              <div className={styles.contactItem}>
                <Phone className={styles.contactIcon} />
                <a href={`tel:${footerConfig.contact.phone}`} className={styles.contactLink}>
                  {footerConfig.contact.phone}
                </a>
              </div>
              <div className={styles.contactItem}>
                <LocationOn className={styles.contactIcon} />
                <span>{footerConfig.contact.location}</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className={styles.footerPart}>
            <div className={styles.footerHeader}>Pratite nas</div>
            <div className={styles.socialLinks}>
              <a href={footerConfig.socialMedia.facebook} className={styles.socialLink} aria-label="Facebook">
                <Facebook />
              </a>
              <a href={footerConfig.socialMedia.twitter} className={styles.socialLink} aria-label="Twitter">
                <Twitter />
              </a>
              <a href={footerConfig.socialMedia.instagram} className={styles.socialLink} aria-label="Instagram">
                <Instagram />
              </a>
              <a href={footerConfig.socialMedia.linkedin} className={styles.socialLink} aria-label="LinkedIn">
                <LinkedIn />
              </a>
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
          © 2025 <Link href="/o-autoru" className={styles.authorLink}>Dražen Simonović</Link>. Sva prava sačuvana.
        </p>
      </div>
      <div className={styles.footerImage}>
        <Image src={footerImage} width={1200} height={300} alt="Footer image" />
      </div>
    </footer>
  );
};
