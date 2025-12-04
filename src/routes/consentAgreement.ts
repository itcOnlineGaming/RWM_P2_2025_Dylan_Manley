let agreementAccepted = false;

export function acceptAgreement() {
  agreementAccepted = true;
}

export function getAgreementStatus() {
	return agreementAccepted;
}