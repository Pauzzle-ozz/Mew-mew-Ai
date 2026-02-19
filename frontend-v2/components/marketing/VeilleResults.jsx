'use client'

import { useState } from 'react'

const SOURCE_TYPE_META = {
  magazine: { label: 'Magazine', color: 'bg-blue-500/10 text-blue-400' },
  website: { label: 'Site web', color: 'bg-green-500/10 text-green-400' },
  blog: { label: 'Blog', color: 'bg-purple-500/10 text-purple-400' },
  newsletter: { label: 'Newsletter', color: 'bg-amber-500/10 text-amber-400' },
  influencer: { label: 'Influenceur', color: 'bg-pink-500/10 text-pink-400' },
  podcast: { label: 'Podcast', color: 'bg-red-500/10 text-red-400' }
}

const IMPORTANCE_COLORS = {
  haute: 'bg-red-500/10 text-red-400 border-red-500/20',
  moyenne: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  emergente: 'bg-green-500/10 text-green-400 border-green-500/20'
}

/* ── Level 1: Sources List ── */
export function SourcesList({ data, onDeepAnalyze, analyzing }) {
  if (!data?.sources || data.sources.length === 0) return null

  return (
    <div className="space-y-6">
      {/* Sector insight */}
      {data.sectorInsight && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-primary mb-2">Apercu du secteur</h3>
          <p className="text-sm text-text-secondary">{data.sectorInsight}</p>
        </div>
      )}

      {/* Sources grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">
            {data.totalSources || data.sources.length} sources identifiees
          </h3>
        </div>

        <div className="grid gap-3">
          {data.sources.map((source, i) => {
            const typeMeta = SOURCE_TYPE_META[source.type] || { label: source.type, color: 'bg-surface-elevated text-text-muted' }
            return (
              <div key={i} className="bg-surface rounded-xl border border-border p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-text-primary truncate">{source.name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeMeta.color}`}>
                        {typeMeta.label}
                      </span>
                      {source.language && source.language !== 'fr' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-elevated text-text-muted">
                          {source.language.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mb-1">{source.description}</p>
                    {source.url && (
                      <p className="text-xs text-text-muted truncate">{source.url}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(n => (
                        <span key={n} className={`text-xs ${n <= (source.authority || 0) ? 'text-primary' : 'text-text-muted/30'}`}>★</span>
                      ))}
                    </div>
                    {source.frequency && (
                      <span className="text-[10px] text-text-muted">{source.frequency}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Deep analyze button */}
      <div className="text-center pt-2">
        <button
          onClick={onDeepAnalyze}
          disabled={analyzing}
          className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 cursor-pointer"
        >
          {analyzing ? 'Analyse en cours...' : 'Aller plus loin — Analyser les tendances'}
        </button>
        <p className="text-xs text-text-muted mt-2">
          L&apos;IA va scraper les sources et en extraire les tendances et idees de contenu
        </p>
      </div>
    </div>
  )
}

/* ── Level 2: Deep Analysis Results ── */
export function DeepAnalysisResults({ data }) {
  const [activeTab, setActiveTab] = useState('trends')

  if (!data) return null

  const tabs = [
    { id: 'trends', label: 'Tendances', count: data.trends?.length || 0 },
    { id: 'ideas', label: 'Idees contenu', count: data.contentIdeas?.length || 0 },
    { id: 'summaries', label: 'Resumes', count: data.sourceSummaries?.length || 0 },
    { id: 'signals', label: 'Signaux faibles', count: data.weakSignals?.length || 0 }
  ]

  return (
    <div className="space-y-6">
      {/* Global summary */}
      {data.globalSummary && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-primary mb-2">Synthese globale</h3>
          <p className="text-sm text-text-secondary">{data.globalSummary}</p>
        </div>
      )}

      {/* Scraping meta */}
      {data.scrapingMeta && (
        <div className="flex flex-wrap gap-3 text-xs text-text-muted">
          <span>{data.scrapingMeta.successfulScrapes}/{data.scrapingMeta.totalSources} sources scrapees</span>
          {data.scrapingMeta.failedSources?.length > 0 && (
            <span className="text-amber-400">
              {data.scrapingMeta.failedSources.length} echec(s)
            </span>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-elevated rounded-xl p-1 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === t.id
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-surface rounded-xl border border-border p-6">

        {/* Trends */}
        {activeTab === 'trends' && (
          <div className="space-y-4">
            {data.trends?.map((trend, i) => (
              <div key={i} className={`rounded-xl border p-4 ${IMPORTANCE_COLORS[trend.importance] || 'border-border'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-text-primary">{trend.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-elevated text-text-muted capitalize">
                    {trend.importance}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mb-2">{trend.description}</p>
                {trend.keywords?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {trend.keywords.map((k, j) => (
                      <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{k}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Content Ideas */}
        {activeTab === 'ideas' && (
          <div className="space-y-3">
            {data.contentIdeas?.map((idea, i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-text-primary text-sm">{idea.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-elevated text-text-muted">
                    {idea.format}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mb-1">{idea.angle}</p>
                {idea.targetAudience && (
                  <p className="text-xs text-text-muted">Cible : {idea.targetAudience}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Source Summaries */}
        {activeTab === 'summaries' && (
          <div className="space-y-4">
            {data.sourceSummaries?.map((source, i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-text-primary text-sm">{source.name}</h4>
                  {source.sentiment && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      source.sentiment === 'positif' ? 'bg-green-500/10 text-green-400' :
                      source.sentiment === 'negatif' ? 'bg-red-500/10 text-red-400' :
                      'bg-surface-elevated text-text-muted'
                    }`}>
                      {source.sentiment}
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary mb-2">{source.summary}</p>
                {source.keyTopics?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {source.keyTopics.map((t, j) => (
                      <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Weak Signals */}
        {activeTab === 'signals' && (
          <div className="space-y-3">
            {data.weakSignals?.length > 0 ? data.weakSignals.map((signal, i) => (
              <div key={i} className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                <h4 className="font-semibold text-text-primary text-sm mb-1">{signal.title}</h4>
                <p className="text-sm text-text-secondary mb-1">{signal.description}</p>
                {signal.potentialImpact && (
                  <p className="text-xs text-green-400">Impact potentiel : {signal.potentialImpact}</p>
                )}
              </div>
            )) : (
              <p className="text-text-muted text-sm text-center py-4">Aucun signal faible detecte</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
