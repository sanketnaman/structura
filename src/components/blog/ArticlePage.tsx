import React from 'react';
import { useParams } from 'react-router-dom';
import { useLocale } from '../../lib/i18n/context';
import { getArticleBySlug, resolveArticleForLocale } from '../../lib/blog/registry';
import { Error404Page } from '../common/Error404Page';
import { ArticleLayout } from './ArticleLayout';

/**
 * Route element for `/blog/:slug` and its localized mirrors (`/es/blog/:slug`,
 * …). The slug is language-invariant; the rendered copy is chosen from the
 * URL locale through `resolveArticleForLocale`, so a localized URL always
 * shows the translation that its canonical, hreflang cluster and `<html lang>`
 * already claim.
 *
 * Unknown slugs fall through to the existing 404 page — the SEO layer has
 * already resolved those paths to the noindex 404 entry, so head tags and
 * body agree.
 */
export const ArticlePage: React.FC = () => {
  const params = useParams<{ slug?: string }>();
  const { urlLocale } = useLocale();
  const article = params.slug ? getArticleBySlug(params.slug) : undefined;
  const localized = article ? resolveArticleForLocale(article, urlLocale) : undefined;

  if (!localized) return <Error404Page />;

  return <ArticleLayout article={localized} />;
};
