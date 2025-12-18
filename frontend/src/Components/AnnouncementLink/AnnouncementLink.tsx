import React, { FC, useState, memo } from "react";
import Link from "next/link";
import { 
  CalendarToday, 
  AccessTime, 
  OpenInNew, 
  BookmarkBorder, 
  Bookmark, 
  Share, 
  Visibility 
} from "@mui/icons-material";
import styles from "./AnnouncementLink.module.scss";

interface AnnouncementLinkProps {
  link: string;
  title: string;
  date: string;
  description?: string;
}

export const AnnouncementLink: FC<AnnouncementLinkProps> = memo(({
  link,
  title,
  date,
  description
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description || '',
          url: window.location.origin + link,
        });
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback za browsere koji ne podržavaju Web Share API
      navigator.clipboard.writeText(window.location.origin + link);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };


  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <article className={styles.announcementItem}>
      <div className={styles.announcementHeader}>
        <div className={styles.dateInfo}>
          <CalendarToday className={styles.dateIcon} aria-hidden="true" />
          <time dateTime={date} className={styles.announcementDate}>
            {date}
          </time>
        </div>
        
        <div className={styles.announcementActions}>
          <button
            onClick={handleBookmark}
            className={`${styles.actionButton} ${isBookmarked ? styles.bookmarked : ''}`}
            aria-label={isBookmarked ? 'Ukloni iz bookmark-a' : 'Dodaj u bookmark'}
            title={isBookmarked ? 'Ukloni iz bookmark-a' : 'Dodaj u bookmark'}
          >
            {isBookmarked ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
          </button>
          
          <button
            onClick={handleShare}
            className={`${styles.actionButton} ${isShared ? styles.shared : ''}`}
            aria-label="Podeli obaveštenje"
            title="Podeli obaveštenje"
          >
            <Share fontSize="small" />
          </button>
        </div>
      </div>

      <Link href={link} className={styles.announcementLink}>
        <h3 className={styles.announcementTitle}>
          {title}
        </h3>
        
        {description && (
          <p className={styles.announcementDescription}>
            {truncateText(description)}
          </p>
        )}
        
        <div className={styles.readMore}>
          <span>Pročitaj više</span>
          <OpenInNew fontSize="small" aria-hidden="true" />
        </div>
      </Link>
    </article>
  );
});

AnnouncementLink.displayName = 'AnnouncementLink';