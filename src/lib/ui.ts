export function generateMatchCardHtml(uid: string, name: string, age: number | undefined, category: string, score: number, description: string, kootaHtml: string, doshas: { name: string, description: string, isCancelled: boolean }[] = []): string {
    const percentage = (score / 36) * 100;

    // Smooth progress bar color depending on Ashta Koota match quality
    const progressColor = score >= 21 ? '#10b981' : score >= 18 ? '#f59e0b' : '#ef4444';

    let doshaHtml = '';
    if (doshas && doshas.length > 0) {
        doshaHtml = `
            <div class="dosha-container" style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 12px; padding: 1rem; margin: 1rem 0;">
                <div class="dosha-header" style="color: #b91c1c; font-weight: 800; font-size: var(--font-xs); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.25rem;">⚠️ Dosha Alerts & Exceptions</div>
                ${doshas.map(d => `
                    <div class="dosha-item ${d.isCancelled ? 'cancelled' : 'active'}" style="margin-bottom: 0.5rem; ${d.isCancelled ? 'opacity: 0.7;' : ''}">
                        <span class="dosha-name" style="font-weight: 700; font-size: var(--font-sm); color: var(--bumble-text); ${d.isCancelled ? 'text-decoration: line-through;' : ''}">${d.name} ${d.isCancelled ? '(Cancelled)' : ''}</span>
                        <div class="dosha-description" style="font-size: var(--font-xs); color: var(--bumble-text-light); line-height: 1.4; margin-top: 0.1rem;">${d.description}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    let descriptionHtml = '';
    if (description) {
        let highlightIcon = 'ℹ️';
        let highlightColor = 'var(--bumble-text-light)';
        let highlightBg = 'var(--bumble-cream)';
        let highlightBorder = 'var(--bumble-border)';
        let categoryTitle = category + ' Match';

        if (category === "Excellent") {
            highlightIcon = '🌟';
            highlightColor = '#059669';
            highlightBg = '#ecfdf5';
            highlightBorder = '#a7f3d0';
        } else if (category === "Very Good") {
            highlightIcon = '✨';
            highlightColor = '#10b981';
            highlightBg = '#f0fdf4';
            highlightBorder = '#bbf7d0';
        } else if (category === "Good") {
            highlightIcon = '👍';
            highlightColor = '#d97706';
            highlightBg = '#fffbeb';
            highlightBorder = '#fde68a';
        } else if (category === "Not Good" || category === "Bad") {
            highlightIcon = '⚠️';
            highlightColor = '#dc2626';
            highlightBg = '#fef2f2';
            highlightBorder = '#fecaca';
        }

        descriptionHtml = `
            <div class="match-highlight" style="background: ${highlightBg}; border: 1.5px solid ${highlightBorder}; display: flex; gap: 0.75rem; padding: 1rem; border-radius: 14px; margin-bottom: 1rem; align-items: flex-start;">
                <div class="match-highlight-icon" style="font-size: 1.5rem; line-height: 1;">${highlightIcon}</div>
                <div class="match-highlight-content" style="font-size: var(--font-sm); color: var(--bumble-text); line-height: 1.5;">
                    <span class="match-highlight-title" style="color: ${highlightColor}; font-weight: 800; text-transform: uppercase; letter-spacing: 0.02em; font-size: var(--font-xs); margin-bottom: 0.25rem; display: block;">${categoryTitle}</span>
                    ${description}
                </div>
            </div>
        `;
    }

    return `
        <div class="match-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
            <div style="display: flex; flex-direction: column; gap: 0.2rem;">
                <span class="match-name" style="font-size: var(--font-xl); font-weight: 800; color: var(--bumble-text); letter-spacing: -0.02em;">${name}${age !== undefined ? `, ${age}` : ''}</span>
                <span style="font-size: var(--font-xs); color: var(--bumble-text-light); font-weight: 700; background-color: var(--bumble-light-grey); padding: 0.15rem 0.5rem; border-radius: 6px; width: fit-content;">ID: ${uid}</span>
            </div>
            <span class="match-category" style="background-color: var(--bumble-yellow); color: var(--bumble-text); padding: 0.35rem 0.75rem; border-radius: 9999px; font-size: var(--font-xs); font-weight: 800; text-transform: uppercase; border: 1.5px solid var(--bumble-yellow); box-shadow: 2px 2px 0 var(--bumble-yellow);">${category}</span>
        </div>
        <div class="match-score-container" style="background: var(--bumble-light-grey); padding: 0.75rem 1rem; border-radius: 12px; margin-bottom: 1rem;">
            <div class="match-score-header" style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.4rem;">
                <div class="match-score-value" style="font-size: var(--font-lg); font-weight: 800; color: var(--bumble-text);">${score} <small class="match-score-max" style="font-size: var(--font-xs); color: var(--bumble-text-light);">/ 36 Points</small></div>
                <div class="match-percentage" style="color: ${progressColor}; font-weight: 800; font-size: var(--font-sm);">${Math.round(percentage)}% Match</div>
            </div>
            <div class="progress-bar-bg" style="background-color: #e4e4e2; height: 8px; border-radius: 9999px; overflow: hidden;">
                <div class="progress-bar-fill" style="width: ${percentage}%; background-color: ${progressColor}; height: 100%; transition: width 0.5s ease-out;"></div>
            </div>
        </div>
        ${descriptionHtml}
        ${doshaHtml}
        ${kootaHtml}
    `;
}
