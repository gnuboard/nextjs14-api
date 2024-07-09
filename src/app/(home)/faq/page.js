// @/app/(home)/faq/page.js

import React from 'react';
import { Typography, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Faq = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        자주하시는 질문 (FAQ)
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">1. 반품 정책은 무엇인가요?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            저희 반품 정책은 구매 후 30일 이내에 반품이 가능합니다. 상품이 원래 상태와 포장으로 유지되었는지 확인해 주세요.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">2. 주문을 어떻게 추적할 수 있나요?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            발송 확인 이메일에 제공된 추적 번호를 사용하여 주문을 추적할 수 있습니다. 저희 추적 페이지에 방문하여 추적 번호를 입력하면 현재 주문 상태를 확인할 수 있습니다.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">3. 국제 배송을 제공하나요?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            네, 저희는 여러 나라로 국제 배송을 제공합니다. 배송비와 배송 시간은 목적지에 따라 다릅니다. 자세한 내용은 저희 배송 정책을 확인해 주세요.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">4. 고객 지원팀에 어떻게 연락할 수 있나요?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            저희 연락 페이지를 통해 고객 지원팀에 연락할 수 있습니다. 이메일, 전화, 라이브 채팅을 통해 지원을 제공하며, 저희 지원팀은 24시간 내내 고객님의 문의에 응대해 드립니다.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">5. 어떤 결제 방법을 허용하나요?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            저희는 신용카드, 직불카드, 페이팔, 은행 이체 등 다양한 결제 방법을 허용합니다. 허용되는 결제 방법의 전체 목록은 저희 결제 정보 페이지에서 확인해 주세요.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Faq;
