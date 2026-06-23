export function generateMatchCardHtml(uid: string, name: string, age: number | undefined, category: string, score: number, description: string, kootaHtml: string, doshas: { name: string, description: string, isCancelled: boolean }[] = []): string {
    const percentage = (score / 36) * 100;
    const progressColor = score >= 21 ? '#10b981' : score >= 18 ? '#f59e0b' : '#ef4444';

    let doshaHtml = '';
    if (doshas && doshas.length > 0) {
        doshaHtml = `
            <div class="dosha-container">
                <div class="dosha-header">Dosha Alerts & Exceptions</div>
                ${doshas.map(d => `
                    <div class="dosha-item ${d.isCancelled ? 'cancelled' : 'active'}">
                        <span class="dosha-name">${d.name} ${d.isCancelled ? '(Cancelled)' : ''}</span>
                        <div class="dosha-description">${d.description}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    return `
        <div class="match-header">
            <div style="display: flex; flex-direction: column;">
                <span class="match-name">${name}${age !== undefined ? `, ${age}` : ''}</span>
                <span style="font-size: var(--font-xs); color: black; font-weight: 600;">ID: ${uid}</span>
            </div>
            <span class="match-category" style="background-color: ${progressColor}">${category}</span>
        </div>
        <div class="match-score-container">
            <div class="match-score-header">
                <div class="match-score-value">${score} <small class="match-score-max">/ 36</small></div>
                <div class="match-percentage" style="color: ${progressColor}">${Math.round(percentage)}% Match</div>
            </div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${percentage}%; background-color: ${progressColor};"></div>
            </div>
        </div>
        ${description ? `<div class="match-description">${description}</div>` : ''}
        ${doshaHtml}
        ${kootaHtml}
    `;
}
