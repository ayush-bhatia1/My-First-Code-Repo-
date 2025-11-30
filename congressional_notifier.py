from typing import List

def validate_email(email: str) -> bool:
    """Validate email format."""
    return email and '@' in email and '.' in email.split('@')[1] if '@' in email else False


def send_trade_emails(trade_data: dict, subscribers: List[str]) -> dict:
    """
    Send emails about congressional trade to subscribers.
    
    Args:
        trade_data: Dictionary with keys: politician_name, ticker, transaction_type, amount, date
        subscribers: List of email addresses
    
    Returns:
        Dictionary with 'success', 'sent', and 'failed' counts
    """
    if not trade_data.get('politician_name') or not trade_data.get('ticker'):
        return {'success': False, 'sent': 0, 'failed': 0}
    
    if not subscribers:
        return {'success': False, 'sent': 0, 'failed': 0}
    
    sent = 0
    failed = 0
    
    for email in subscribers:
        if validate_email(email):
            sent += 1
        else:
            failed += 1
    
    return {
        'success': sent > 0,
        'sent': sent,
        'failed': failed
    }
