// ===================== script.js =====================
document.addEventListener("DOMContentLoaded", () => {

    /* *************************************************
     * 1. 상단 Header 공유 버튼 (#shareBtn)
     ************************************************* */
    const shareBtn = document.getElementById("shareBtn");

    if (shareBtn) {
        shareBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const shareData = {
                title: "Soonchan Park’s Portfolio",
                text: "Check out my portfolio.",
                url: window.location.href,
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    console.error("공유 취소/오류:", err);
                }
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(window.location.href);
                alert("링크가 복사되었습니다.");
            } else {
                const temp = document.createElement("input");
                temp.value = window.location.href;
                document.body.appendChild(temp);
                temp.select();
                document.execCommand("copy");
                temp.remove();
                alert("링크가 복사되었습니다.");
            }
        });
    }

    /* *************************************************
     * 2. 모바일 메뉴 토글
     ************************************************* */
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".nav-toggle");

    if (toggle && header) {
        toggle.addEventListener("click", () => header.classList.toggle("open"));
    }

    /* *************************************************
     * 3. 스크롤 섹션 확대효과 (.scale-section)
     ************************************************* */
    const scaleTargets = document.querySelectorAll(".scale-section");

    if (scaleTargets.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.intersectionRatio > 0.6) entry.target.classList.add("is-center");
                    else entry.target.classList.remove("is-center");
                });
            },
            { threshold: [0, 0.3, 0.6, 1] }
        );

        scaleTargets.forEach((el) => observer.observe(el));
    }

    /* *************************************************
     * 4. 포트폴리오 상세 모달
     ************************************************* */
    const modalOverlay = document.getElementById("portfolioModal");

    const modalImg = document.getElementById("modalImage");
    const modalTag = document.getElementById("modalTag");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");

    const modalPurpose = document.getElementById("modalPurpose");
    const modalDuration = document.getElementById("modalDuration");
    const modalMembers = document.getElementById("modalMembers");
    const modalModel = document.getElementById("modalModel");

    const closeBtn = document.querySelector(".portfolio-modal-close");
    const viewPortfolioBtn = document.getElementById("viewPortfolioBtn");

    let currentPDF = ""; // PDF 경로 저장

    document.querySelectorAll(".audience-card").forEach(card => {
        card.addEventListener("click", () => {

            const imgEl = card.querySelector(".audience-card_img img");
            modalImg.src = imgEl?.src || "";
            modalImg.alt = imgEl?.alt || "";

            modalTag.textContent = card.querySelector("h4")?.textContent || "";
            modalTitle.textContent = card.querySelector("h3")?.textContent || "";
            modalDesc.textContent = card.querySelector("p")?.textContent || "";

            modalPurpose.textContent = card.dataset.purpose || "";
            modalDuration.textContent = card.dataset.duration || "";
            modalMembers.textContent = card.dataset.members || "";
            modalModel.textContent = card.dataset.model || "";

            currentPDF = card.dataset.pdf || "";

            modalOverlay.classList.add("is-open");
            document.body.style.overflow = "hidden";
        });
    });

    const closePortfolioModal = () => {
        modalOverlay.classList.remove("is-open");
        document.body.style.overflow = "";
    };

    if (closeBtn) closeBtn.addEventListener("click", closePortfolioModal);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closePortfolioModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalOverlay.classList.contains("is-open")) {
            closePortfolioModal();
        }
    });

    /* *************************************************
     * 5. PDF 모달 (UI 없는 순수 PDF만! 크기 유지)
     ************************************************* */

    const pdfModal = document.getElementById("pdfModal");
    const pdfViewer = document.getElementById("pdfViewer");
    const pdfCloseBtn = document.getElementById("pdfCloseBtn");

    if (viewPortfolioBtn) {
        viewPortfolioBtn.addEventListener("click", () => {
            if (!currentPDF) {
                alert("PDF 파일을 찾을 수 없습니다.");
                return;
            }

            // PDF UI 제거 옵션 적용
            const cleanPDF =
                currentPDF +
                "#toolbar=0&navpanes=0&scrollbar=0&zoom=100";

            pdfViewer.src = cleanPDF;

            pdfModal.classList.add("is-open");
            document.body.style.overflow = "hidden";

            // 모바일/PC 모두 가로폭 꽉 채우기 + 세로 스크롤 활성화
            pdfViewer.src = pdfPath + "#toolbar=0&navpanes=0&scrollbar=0&zoom=page-width";
        });
    }

    const closePdfModal = () => {
        pdfModal.classList.remove("is-open");
        pdfViewer.src = "";
        document.body.style.overflow = "";
    };

    if (pdfCloseBtn) pdfCloseBtn.addEventListener("click", closePdfModal);

    pdfModal.addEventListener("click", (e) => {
        if (e.target === pdfModal) closePdfModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && pdfModal.classList.contains("is-open")) {
            closePdfModal();
        }
    });

    /* *************************************************
     * 6. PHOTO 섹션 애니메이션
     ************************************************* */
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
