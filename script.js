// =============================
// 0. DOMContentLoaded
// =============================
document.addEventListener("DOMContentLoaded", () => {

    /* =============================
       1. 공유 버튼 (#shareBtn)
    ============================= */
    const shareBtn = document.getElementById("shareBtn");

    if (shareBtn) {
        shareBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            const shareData = {
                title: "Soonchan Park Portfolio",
                text: "Check out my portfolio",
                url: window.location.href,
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {}
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(window.location.href);
                alert("링크가 복사되었습니다.");
            }
        });
    }

    /* =============================
       2. 상세 모달 요소 가져오기
    ============================= */
    const modalOverlay = document.getElementById("portfolioModal");
    const modalImg = document.getElementById("modalImage");
    const modalTag = document.getElementById("modalTag");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");

    const modalPurpose = document.getElementById("modalPurpose");
    const modalDuration = document.getElementById("modalDuration");
    const modalMembers = document.getElementById("modalMembers");
    const modalModel = document.getElementById("modalModel");

    const viewPortfolioBtn = document.getElementById("viewPortfolioBtn");

    /* =============================
       3. PDF 모달 요소
    ============================= */
    const pdfModal = document.getElementById("pdfModal");
    const pdfViewer = document.getElementById("pdfViewer");
    const pdfTitle = document.getElementById("pdfTitle");
    const pdfCloseBtn = document.getElementById("pdfCloseBtn");

    /* =============================
       4. 포트폴리오 카드 클릭
    ============================= */
    const cards = document.querySelectorAll(".audience-card");
    let currentPDF = "";

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            // 이미지
            const imgEl = card.querySelector(".audience-card_img img");
            modalImg.src = imgEl.src;

            // 텍스트
            modalTag.textContent = card.querySelector("h4").textContent;
            modalTitle.textContent = card.querySelector("h3").textContent;
            modalDesc.textContent = card.querySelector("p").textContent;

            modalPurpose.textContent = card.dataset.purpose;
            modalDuration.textContent = card.dataset.duration;
            modalMembers.textContent = card.dataset.members;
            modalModel.textContent = card.dataset.model;

            // PDF 경로 저장
            currentPDF = card.dataset.pdf;

            // 상세 모달 열기
            modalOverlay.classList.add("is-open");
            document.body.style.overflow = "hidden";
        });
    });

    /* =============================
       5. 포트폴리오 보기 → PDF 모달 열기
    ============================= */
    if (viewPortfolioBtn) {
        viewPortfolioBtn.addEventListener("click", () => {
            if (!currentPDF) return;

            // 툴바 제거한 PDF URL
            const pdfURL = `${currentPDF}#toolbar=0&navpanes=0&scrollbar=0`;

            pdfViewer.src = pdfURL;
            pdfTitle.textContent = "포트폴리오 PDF";

            // PDF 모달 실행
            pdfModal.classList.add("is-open");

            // 상세 모달 닫기
            modalOverlay.classList.remove("is-open");
        });
    }

    /* =============================
       6. 상세 모달 닫기
    ============================= */
    const modalCloseBtn = document.querySelector(".portfolio-modal-close");

    function closeDetailModal() {
        modalOverlay.classList.remove("is-open");
        document.body.style.overflow = "";
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", closeDetailModal);
    }

    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeDetailModal();
    });

    /* =============================
       7. PDF 모달 닫기
    ============================= */
    function closePDF() {
        pdfModal.classList.remove("is-open");
        pdfViewer.src = ""; // PDF 초기화 (모바일 오류 방지)
    }

    pdfCloseBtn.addEventListener("click", closePDF);

    pdfModal.addEventListener("click", (e) => {
        if (e.target === pdfModal) closePDF();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closePDF();
            closeDetailModal();
        }
    });

    /* =============================
       8. PHOTO 애니메이션
    ============================= */
    const photoItems = document.querySelectorAll(".photo-anim");

    if (photoItems.length > 0) {
        const photoObserver = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        photoItems.forEach((el) => photoObserver.observe(el));
    }
});
