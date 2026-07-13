export function generateMatchCardHtml(
    uid: string,
    name: string,
    age: number | undefined,
    category: string,
    score: number,
    description: string,
    kootaHtml: string,
    doshas: { name: string, description: string, isCancelled: boolean }[] = [],
    extraDetails?: {
        occupation?: string;
        education?: string;
        income?: string;
        religion?: string;
        height?: string;
        maritalStatus?: string;
        currentLocation?: string;
        bio?: string;
    }
): string {
    const percentage = (score / 36) * 100;

    // Smooth progress bar color depending on Ashta Koota match quality
    const progressColor = score >= 21 ? '#10b981' : score >= 18 ? '#f59e0b' : '#ef4444';

    let doshaHtml = '';
    if (doshas && doshas.length > 0) {
        doshaHtml = `
            <div class="dosha-container" style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 12px; padding: 1rem; margin: 1rem 0;">
                <div class="dosha-header" style="color: #b91c1c; font-weight: 800; font-size: var(--font-xs); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.35rem;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <span>Dosha Alerts & Exceptions</span>
                </div>
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
        let highlightIcon = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
        `;
        let highlightColor = 'var(--bumble-text-light)';
        let highlightBg = 'var(--bumble-cream)';
        let highlightBorder = 'var(--bumble-border)';
        let categoryTitle = category + ' Match';

        if (category === "Excellent") {
            highlightIcon = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            `;
            highlightColor = '#059669';
            highlightBg = '#ecfdf5';
            highlightBorder = '#a7f3d0';
        } else if (category === "Very Good") {
            highlightIcon = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            `;
            highlightColor = '#10b981';
            highlightBg = '#f0fdf4';
            highlightBorder = '#bbf7d0';
        } else if (category === "Good") {
            highlightIcon = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
            `;
            highlightColor = '#d97706';
            highlightBg = '#fffbeb';
            highlightBorder = '#fde68a';
        } else if (category === "Not Good" || category === "Bad") {
            highlightIcon = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            `;
            highlightColor = '#dc2626';
            highlightBg = '#fef2f2';
            highlightBorder = '#fecaca';
        }

        descriptionHtml = `
            <div class="match-highlight" style="background: ${highlightBg}; border: 1.5px solid ${highlightBorder}; display: flex; gap: 0.75rem; padding: 1rem; border-radius: 14px; margin-bottom: 1rem; align-items: flex-start;">
                <div class="match-highlight-icon" style="color: ${highlightColor}; flex-shrink: 0; padding-top: 0.15rem;">${highlightIcon}</div>
                <div class="match-highlight-content" style="font-size: var(--font-sm); color: var(--bumble-text); line-height: 1.5;">
                    <span class="match-highlight-title" style="color: ${highlightColor}; font-weight: 800; text-transform: uppercase; letter-spacing: 0.02em; font-size: var(--font-xs); margin-bottom: 0.25rem; display: block;">${categoryTitle}</span>
                    ${description}
                </div>
            </div>
        `;
    }

    let extraDetailsHtml = '';
    if (extraDetails) {
        const detailsList = [
            { label: 'Profession', value: extraDetails.occupation, icon: '💼' },
            { label: 'Education', value: extraDetails.education, icon: '🎓' },
            { label: 'Income', value: extraDetails.income, icon: '💰' },
            { label: 'Religion', value: extraDetails.religion, icon: '📿' },
            { label: 'Height', value: extraDetails.height, icon: '📏' },
            { label: 'Marital Status', value: extraDetails.maritalStatus, icon: '💍' },
            { label: 'Current Location', value: extraDetails.currentLocation, icon: '📍' }
        ].filter(d => d.value && d.value !== 'N/A' && d.value !== '');

        let bioHtml = '';
        if (extraDetails.bio && extraDetails.bio.trim() !== '') {
            bioHtml = `
                <div class="match-bio" style="font-size: var(--font-sm); color: var(--bumble-text); font-style: italic; background-color: var(--bumble-light-yellow); padding: 0.75rem 1rem; border-radius: 12px; border-left: 3px solid var(--bumble-yellow); line-height: 1.45; margin-top: 0.5rem; margin-bottom: 0.25rem; font-weight: 500;">
                    "${extraDetails.bio.trim()}"
                </div>
            `;
        }

        if (detailsList.length > 0 || bioHtml !== '') {
            let pillsHtml = '';
            if (detailsList.length > 0) {
                pillsHtml = `
                    <div class="match-extra-details" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${detailsList.map(d => `
                            <span class="detail-pill" style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: var(--font-xs); font-weight: 700; color: var(--bumble-text); background-color: var(--bumble-cream); border: 1.5px solid var(--bumble-border); padding: 0.35rem 0.75rem; border-radius: 9999px; line-height: 1.2;">
                                <span>${d.icon}</span>
                                <span>${d.value}</span>
                            </span>
                        `).join('')}
                    </div>
                `;
            }

            extraDetailsHtml = `
                <div class="match-profile-section" style="margin: 1rem 0; padding-top: 0.75rem; border-top: 1px dashed var(--bumble-border); border-bottom: 1px dashed var(--bumble-border); padding-bottom: 0.75rem;">
                    ${pillsHtml}
                    ${bioHtml}
                </div>
            `;
        }
    }

    return `
        <div class="match-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
            <div style="display: flex; flex-direction: column; gap: 0.2rem;">
                <span class="match-name" style="font-size: var(--font-xl); font-weight: 800; color: var(--bumble-text); letter-spacing: -0.02em;">${name}${age !== undefined ? `, ${age}` : ''}</span>
                <div style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: var(--font-xs); color: var(--bumble-text-light); font-weight: 700; background-color: var(--bumble-light-grey); padding: 0.15rem 0.5rem; border-radius: 6px; width: fit-content;">
                    <span>ID: ${uid}</span>
                    <button class="copy-uid-btn" data-uid="${uid}" title="Copy User ID" style="background: none; border: none; padding: 0.1rem 0.2rem; margin: 0; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; color: var(--bumble-text-light); transition: color 0.2s; vertical-align: middle; height: auto; min-height: 0; outline: none; box-shadow: none;" onmouseover="this.style.color='var(--bumble-text)'" onmouseout="this.style.color='var(--bumble-text-light)'">
                        <svg class="copy-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span class="copied-text" style="display: none; font-size: 10px; font-weight: 800; color: #10b981; margin-left: 0.25rem;">Copied!</span>
                    </button>
                </div>
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
        ${extraDetailsHtml}
        ${descriptionHtml}
        ${doshaHtml}
        ${kootaHtml}
    `;
}
