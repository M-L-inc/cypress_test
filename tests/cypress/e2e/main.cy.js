describe('マーケティング自動化管理', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:3000/');
    });

    it('ページにアクセスし、タイトルを確認する', () => {
        cy.title().should('eq', 'マーケティング自動化管理');
    });

    it('デフォルトでダッシュボードタブがアクティブになっている', () => {
        cy.get('.nav-item.active').should('contain', 'ダッシュボード');
        cy.get('#dashboard').should('be.visible');
        cy.get('#page-title').should('have.text', 'ダッシュボード');
    });

    describe('テーブルのテスト', () => {
        it('ダッシュボードの最近のアクティビティテーブルをテストする', () => {
            cy.get('#dashboard .table').within(() => {
                cy.get('thead th').should('have.length', 4);
                cy.get('thead th').eq(0).should('have.text', 'アクション');
                cy.get('thead th').eq(1).should('have.text', '対象');
                cy.get('thead th').eq(2).should('have.text', '時間');
                cy.get('thead th').eq(3).should('have.text', 'ステータス');

                cy.get('tbody tr').first().within(() => {
                    cy.get('td').eq(0).should('have.text', 'メール送信');
                    cy.get('td').eq(1).should('have.text', 'ニュースレター #45');
                    cy.get('td').eq(2).should('have.text', '5分前');
                    cy.get('td').eq(3).find('.badge.success').should('have.text', '完了');
                });
            });
        });

        it('メール管理のテンプレートテーブルをテストする', () => {
            cy.get('.nav-item[data-tab="emails"]').click();
            cy.get('#emails .table').within(() => {
                cy.get('thead th').should('have.length', 5);
                cy.get('thead th').eq(0).should('have.text', 'テンプレート名');
                cy.get('thead th').eq(1).should('have.text', '件名');
                cy.get('thead th').eq(2).should('have.text', '最終更新');
                cy.get('thead th').eq(3).should('have.text', '使用回数');
                cy.get('thead th').eq(4).should('have.text', '操作');

                cy.get('tbody tr').first().within(() => {
                    cy.get('td').eq(0).should('have.text', 'ニュースレター');
                    cy.get('td').eq(1).should('have.text', '今週の最新情報');
                    cy.get('td').eq(2).should('have.text', '2025/11/12');
                    cy.get('td').eq(3).should('have.text', '156');
                    cy.get('td').eq(4).find('button').should('have.length', 2);
                    cy.get('td').eq(4).find('button').first().should('have.text', '編集');
                    cy.get('td').eq(4).find('button').last().should('have.text', '複製');
                });
            });
        });

        it('セグメント管理のテーブルをテストする', () => {
            cy.get('.nav-item[data-tab="segments"]').click();
            cy.get('#segments .table').within(() => {
                cy.get('thead th').should('have.length', 6);
                cy.get('thead th').eq(0).should('have.text', 'セグメント名');
                cy.get('thead th').eq(1).should('have.text', '条件');
                cy.get('thead th').eq(2).should('have.text', 'ユーザー数');
                cy.get('thead th').eq(3).should('have.text', '作成日');
                cy.get('thead th').eq(4).should('have.text', 'ステータス');
                cy.get('thead th').eq(5).should('have.text', '操作');

                cy.get('tbody tr').first().within(() => {
                    cy.get('td').eq(0).should('have.text', 'プレミアムユーザー');
                    cy.get('td').eq(1).should('have.text', 'プラン = プレミアム');
                    cy.get('td').eq(2).should('have.text', '1,234');
                    cy.get('td').eq(3).should('have.text', '2025/10/15');
                    cy.get('td').eq(4).find('.badge.success').should('have.text', 'アクティブ');
                    cy.get('td').eq(5).find('button').should('have.length', 2);
                    cy.get('td').eq(5).find('button').first().should('have.text', '編集');
                    cy.get('td').eq(5).find('button').last().should('have.text', '削除');
                });
            });
        });
    });

    const tabs = [
        { name: 'メール管理', 'data-tab': 'emails' },
        { name: 'セグメント管理', 'data-tab': 'segments' },
        { name: 'スケジューラ', 'data-tab': 'scheduler' },
        { name: 'オートメーション', 'data-tab': 'automation' },
        { name: 'レポート', 'data-tab': 'reports' },
    ];

    tabs.forEach(tab => {
        it(`${tab.name}タブに切り替える`, () => {
            cy.get(`.nav-item[data-tab="${tab['data-tab']}"]`).click();
            cy.get('.nav-item.active').should('contain', tab.name);
            cy.get(`#${tab['data-tab']}`).should('be.visible');
            cy.get('#page-title').should('have.text', tab.name);
        });
    });

    describe('新規作成モーダル', () => {
        it('モーダルを開き、閉じる', () => {
            cy.get('#new-action').click();
            cy.get('#action-modal').should('be.visible');
            cy.get('#close-modal').click();
            cy.get('#action-modal').should('not.be.visible');

            cy.get('#new-action').click();
            cy.get('#cancel-modal').click();
            cy.get('#action-modal').should('not.be.visible');
        });

        it('モーダル外のクリックで閉じる', () => {
            cy.get('#new-action').click();
            cy.get('#action-modal').should('be.visible');
            cy.get('body').click(0, 0);
            cy.get('#action-modal').should('not.be.visible');
        });

        it('ドロップダウンで表示フォームを切り替える', () => {
            cy.get('#new-action').click();
            
            cy.get('#action-type').select('email');
            cy.get('#email-form').should('be.visible');
            cy.get('#segment-form').should('not.be.visible');

            cy.get('#action-type').select('segment');
            cy.get('#email-form').should('not.be.visible');
            cy.get('#segment-form').should('be.visible');

            cy.get('#action-type').select('');
            cy.get('#email-form').should('not.be.visible');
            cy.get('#segment-form').should('not.be.visible');
        });
    });

    describe('メール管理タブ', () => {
        beforeEach(() => {
            cy.get('.nav-item[data-tab="emails"]').click();
        });

        it('デフォルトでテンプレートタブがアクティブ', () => {
            cy.get('.tab.active[data-email-tab="templates"]').should('exist');
            cy.get('#templates.email-tab-content.active').should('be.visible');
        });

        it('送信済みタブに切り替える', () => {
            cy.get('.tab[data-email-tab="sent"]').click();
            cy.get('.tab.active[data-email-tab="sent"]').should('exist');
            cy.get('#sent.email-tab-content.active').should('be.visible').and('contain', '送信済みメールの履歴が表示されます。');
        });

        it('下書きタブに切り替える', () => {
            cy.get('.tab[data-email-tab="drafts"]').click();
            cy.get('.tab.active[data-email-tab="drafts"]').should('exist');
            cy.get('#drafts.email-tab-content.active').should('be.visible').and('contain', '下書きメールが表示されます。');
        });
    });
});
