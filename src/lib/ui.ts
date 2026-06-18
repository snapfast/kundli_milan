export function generateMatchCardHtml(name: string, category: string, score: number, description: string, kootaHtml: string): string {
    const percentage = (score / 36) * 100;
    const progressColor = score >= 28 ? '#00b894' : score >= 18 ? '#fdcb6e' : '#ff7675';

    return `
        <div class="match-header">
            <span class="match-name">${name}</span>
            <span class="match-category" style="background-color: ${progressColor}">${category}</span>
        </div>
        <div class="match-score-container">
            <div class="match-score">${score} / 36</div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${percentage}%; background-color: ${progressColor};"></div>
            </div>
        </div>
        ${description ? `<div class="match-description">${description}</div>` : ''}
        ${kootaHtml}
    `;
}
