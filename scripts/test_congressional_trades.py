from congressional_notifier import validate_email, send_trade_emails


def run_tests():
    
    print("\nRunning tests...\n")
    
    # Test 1-2: Email validation
    assert validate_email("user@example.com") == True
    assert validate_email("invalid.email") == False
    print("PASS: Tests 1-2 - Email validation")
    
    # Test 3-4: Valid trade with subscribers
    trade = {
        'politician_name': 'Senator Smith',
        'ticker': 'AAPL',
        'transaction_type': 'buy',
        'amount': 50000,
        'date': '2025-11-01'
    }
    result = send_trade_emails(trade, ['user@example.com', 'test@test.com'])
    assert result['success'] == True
    assert result['sent'] == 2
    print("PASS: Tests 3-4 - Valid trade processing")
    
    # Test 5-6: Invalid trade (missing politician)
    invalid_trade = {'ticker': 'TSLA'}
    result = send_trade_emails(invalid_trade, ['user@example.com'])
    assert result['success'] == False
    assert result['sent'] == 0
    print("PASS: Tests 5-6 - Invalid trade handling")
    
    # Test 7-8: Mixed valid/invalid emails
    result = send_trade_emails(trade, ['valid@email.com', 'invalid', 'another@valid.com'])
    assert result['sent'] == 2
    assert result['failed'] == 1
    print("PASS: Tests 7-8 - Mixed email validation")
    
    # Test 9-10: No subscribers
    result = send_trade_emails(trade, [])
    assert result['success'] == False
    assert result['sent'] == 0
    print("PASS: Tests 9-10 - Empty subscriber list")
    
    print("\nAll 10 assert statements passed.\n")


if __name__ == "__main__":
    run_tests()
