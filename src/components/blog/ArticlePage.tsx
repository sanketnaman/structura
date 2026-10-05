import React from 'react';
import { useParams } from 'react-router-dom';
import { getArticleBySlug } from '../../lib/blog/registry';
import { Error404Page } from '../common/Error404Page';
import { ArticleLayout } from './ArticleLayout';

/**
 * Route element for `/blog/:slug` and its localized mirrors. Unknown slugs
 * fall through to the existing 404 page — the SEO layer has already resolved
 * those paths to the noindex 404 entry, so head tags and body agree.
 */
export const ArticlePage: React.FC = () => {
  const params = useParams<{ slug?: string }>();
  const article = params.slug ? getArticleBySlug(params.slug) : undefined;

  if (!article) return <Error404Page />;

  return <ArticleLayout article={article} />;
};
