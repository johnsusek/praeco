# Alerts Implementation Guide

## Overview

This guide provides comprehensive information on how to implement and configure alerts in Praeco. Praeco supports a wide variety of alert notification destinations through ElastAlert 2, allowing you to send notifications to Slack, Email, MS Teams, webhooks, and many other services.

Praeco provides a user-friendly GUI for configuring these alerts, eliminating the need to manually edit YAML configuration files. This guide covers:
- Setting up alert destinations
- Configuring alert content and formatting
- Testing alerts before deployment
- Troubleshooting common issues
- Best practices for each alert type

## Supported Alert Types

Praeco supports the following alert destinations:

| Alert Type | Description | Common Use Case |
|------------|-------------|-----------------|
| Slack | Send notifications to Slack channels | Team collaboration |
| MS Teams | Microsoft Teams notifications | Enterprise teams |
| Email | SMTP email notifications | General alerting |
| Telegram | Telegram messenger notifications | Mobile-first teams |
| HTTP POST | Custom webhook with basic auth | Custom integrations |
| HTTP POST 2 | Advanced webhook with full control | Complex integrations |
| Jira | Create Jira tickets | Issue tracking |
| Google Chat | Google Workspace notifications | Google-centric teams |
| Mattermost | Self-hosted chat notifications | Privacy-focused teams |
| Command | Execute shell commands | Automation |
| Gitter | Gitter chat notifications | Open source projects |
| AWS SNS | Amazon Simple Notification Service | AWS integrations |
| AWS SES | Amazon Simple Email Service | Scalable email |
| Zabbix | Zabbix monitoring system | Infrastructure monitoring |
| Twilio | SMS and voice notifications | Critical alerts |
| PagerTree | Incident management | On-call routing |
| Exotel | Cloud telephony platform | Voice alerts (India) |
| Stomp | Messaging protocol | Message queues |
| Splunk On-Call | Incident response (formerly VictorOps) | On-call management |
| ServiceNow | IT service management | Enterprise ITSM |
| Chatwork | Business chat platform | Japanese enterprises |
| Discord | Community chat platform | Communities |
| TheHive | Security incident response | Security teams |
| Alerta | Alert consolidation | Alert aggregation |
| Datadog | Monitoring and analytics | Cloud monitoring |
| Rocket.Chat | Self-hosted chat | Privacy-focused teams |
| PagerDuty | Incident management | On-call scheduling |
| Tencent SMS | SMS service | Alerts in China |
| Alertmanager | Prometheus alerting | Prometheus users |
| Dingtalk | Enterprise communication | Chinese enterprises |
| Opsgenie | Incident management | DevOps teams |
| Graylog GELF | Graylog logging | Log management |
| Lark | Enterprise collaboration | ByteDance teams |
| IRIS | Incident response | Security operations |
| WorkWeChat | Enterprise WeChat | Chinese enterprises |
| Matrix Hookshot | Matrix protocol | Decentralized chat |
| MS Power Automate | Workflow automation | Microsoft automation |
| Webex | Cisco collaboration | Enterprise meetings |
| YZJ | Custom alerting | Specific integrations |
| Flashduty | Incident management | On-call scheduling |
| LINE Message API | LINE messenger | Popular in Asia |

## General Alert Configuration

### Alert Settings

All alerts in Praeco share some common configuration options:

#### Re-alert

Controls how often you receive alerts for the same rule:
- **Purpose**: Prevents alert flooding
- **Default**: Alerts sent at most once per configured interval
- **Warning**: Setting to 0 minutes means you'll receive an alert every time the rule triggers
- **Per-group**: When using grouping, re-alert applies to each group independently

#### Aggregation

Group multiple alerts together to reduce notification volume:
- **Schedule**: Set time window for aggregating alerts
- **Use Cases**: High-frequency alerts that can be batched

#### Buffer Time

- **Purpose**: Look back period for gathering context
- **Use Case**: Include historical data in alerts

#### Time Window Features

- **Purpose**: Restrict alerts to specific time periods
- **Use Cases**: Only alert during business hours, exclude maintenance windows

#### Limit Execution

- **Purpose**: Control when rules run
- **Use Cases**: Only execute during specific time periods

#### Kibana Discover

- **Purpose**: Include links to Kibana for alert investigation
- **Use Cases**: Quick access to relevant logs

#### Owner

- **Purpose**: Assign alert ownership
- **Use Cases**: On-call routing, team identification

#### Priority

- **Purpose**: Set alert severity
- **Levels**: Critical, High, Medium, Low
- **Use Cases**: Alert classification and routing

#### Description

- **Purpose**: Document what the alert monitors
- **Best Practice**: Include troubleshooting steps and runbook links

### Alert Subject and Body

Configure the content of your alerts:

#### Alert Subject

- **Purpose**: Email subject line or notification title
- **Variables**: Use `{0}`, `{1}`, etc. to reference alert_subject_args fields
- **Best Practice**: Include key identifying information

#### Alert Subject Args

- **Purpose**: Dynamic fields to include in subject
- **Example**: Add field names like `hostname`, `error_type`
- **Usage**: Click "Add alert_subject_args" and enter field names

#### Alert Body

- **Purpose**: Main alert content
- **Variables**: Use `{0}`, `{1}`, etc. to reference alert_text_args fields
- **Formatting**: Supports markdown or HTML depending on destination

#### Alert Text Args

- **Purpose**: Dynamic fields to include in body
- **Example**: Add fields like `message`, `stack_trace`, `user_id`
- **Usage**: Click "Add alert_text_args" and enter field names

## Configuration: BaseRule.config

Many alert destinations require API keys, tokens, or URLs to be configured in the `rules/BaseRule.config` file. This file applies settings to all rules and should contain sensitive credentials that shouldn't be in individual rule files.

**Location**: `rules/BaseRule.config`

**Format**: YAML

**Basic structure**:
```yaml
# BaseRule.config
slack_webhook_url: ''
telegram_bot_token: ''
# Add other global settings here
```

## Alert-Specific Configuration

### Slack

**Purpose**: Send notifications to Slack channels or users

**Prerequisites**:
1. Create a Slack webhook URL from your Slack workspace
2. Add webhook URL to `BaseRule.config`

**BaseRule.config setup**:
```yaml
slack_webhook_url: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'
```

**Praeco Configuration**:
- **Slack Webhook URLs**: Can add multiple webhooks for different channels
- **Slack Channel Override**: Override the default channel (e.g., `#alerts`)
- **Slack Username Override**: Change the bot username
- **Slack Icon Emoji Override**: Custom emoji for the bot (e.g., `:warning:`)
- **Slack Icon URL Override**: Custom icon URL for the bot
- **Slack Msg Color**: Color of message attachment (good, warning, danger, or hex)
- **Slack Parse Override**: How Slack parses the message (none, full)
- **Slack Text String**: Custom text template
- **Slack Title**: Message title
- **Slack Title Link**: URL to link from title
- **Slack Timeout**: Connection timeout in seconds
- **Slack CA Certs**: Path to CA certificate for SSL verification

> **⚠️ Security Warning**: The "Ignore SSL Errors" option is available but **strongly discouraged** in production. Disabling SSL verification:
> - Exposes you to man-in-the-middle (MITM) attacks
> - Allows attackers to intercept sensitive alert data
> - Should ONLY be used in isolated development/testing environments
> - Never use in production or with sensitive data
> 
> **Instead**: Provide proper CA certificates via the CA Certs option

**Best Practices**:
- Use different channels for different alert priorities
- Set appropriate colors (red for critical, yellow for warnings)
- Include links back to Kibana or Praeco
- Test with non-production channels first

**Troubleshooting**:
- 404 error: Channel/username doesn't exist
- Authentication error: Check webhook URL is correct
- Messages not appearing: Verify bot permissions

### MS Teams

**Purpose**: Send notifications to Microsoft Teams channels

**Prerequisites**:
1. Create an Incoming Webhook in Teams
2. Configure webhook URL in Praeco

**Praeco Configuration**:
- **MS Teams Webhook URL**: The incoming webhook URL from Teams (required)
- **MS Teams Alert Summary**: Summary text for the notification
- **MS Teams Theme Color**: Card color in hex format (e.g., `00ff00` for green)
- **MS Teams Proxy**: HTTP proxy if needed

**Best Practices**:
- Use color coding: Red for critical, yellow for warnings, green for info
- Keep summary concise but descriptive
- Test webhook URLs before deploying

### Email

**Purpose**: Send email notifications via SMTP

**Prerequisites**:
1. SMTP server access
2. SMTP credentials (if authentication required)
3. Configure SMTP settings in `BaseRule.config` or per-rule

**BaseRule.config setup** (optional):
```yaml
smtp_host: 'smtp.gmail.com'
smtp_port: 587
smtp_ssl: true
smtp_auth_file: '/opt/elastalert/smtp/smtp_auth_user.yaml'
```

**SMTP Auth File** (`smtp_auth_user.yaml`):
```yaml
user: your-email@gmail.com
password: your-password
```

**Praeco Configuration**:
- **From Address**: Sender email (default: ElastAlert2@hostname)
- **Reply To**: Reply-to email address
- **To**: Recipient email addresses (comma-separated, required)
- **CC**: Carbon copy recipients (comma-separated)
- **BCC**: Blind carbon copy recipients (comma-separated)
- **SMTP SSL**: Use TLS connection
- **SMTP Host**: SMTP server hostname
- **SMTP Port**: SMTP server port (default: 25)
- **SMTP Auth File**: Path to authentication credentials file
- **SMTP Key File**: Path to TLS key file
- **SMTP Cert File**: Path to TLS certificate file

**Gmail Setup**:
1. **Important**: Google no longer supports "less secure apps" (deprecated May 2022)
2. **Required**: Use App Passwords for 2FA-enabled accounts:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate an app password for "Mail"
   - Use this password in smtp_auth_user.yaml
3. **Alternative**: Use OAuth2 authentication (requires ElastAlert 2 OAuth support)
4. Configure SMTP: `smtp.gmail.com:587` with SSL

**Microsoft 365**:
- **SMTP Authentication**: Supported via App Passwords or OAuth2
- **Setup for Microsoft 365**:
  1. Enable SMTP AUTH in Microsoft 365 admin center
  2. Use `smtp.office365.com:587` with STARTTLS
  3. For OAuth2: Configure Azure AD application
  4. For App Password: Generate in account security settings
- **Alternative**: Use MS Teams alert type for better integration

**Best Practices**:
- Use descriptive subject lines
- Include relevant log snippets in body
- Avoid sending to large distribution lists for high-frequency alerts
- Consider HTML formatting for better readability

**Troubleshooting**:
- Connection refused: Check SMTP host and port
- Authentication failed: Verify credentials in auth file
- Gmail authentication issues: Use App Passwords (see Gmail Setup section)
- Timeout: Check firewall rules and network connectivity

### Telegram

**Purpose**: Send notifications to Telegram chat or channel

**Prerequisites**:
1. Create a Telegram bot via @BotFather
2. Get bot token from BotFather
3. Get chat ID for your channel/group
4. Add bot token to `BaseRule.config`

**BaseRule.config setup**:
```yaml
telegram_bot_token: 'YOUR_BOT_TOKEN_HERE'
```

**Finding Chat ID**:
1. Add bot to your channel/group
2. Send a message to the channel
3. Visit `https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates`
4. Look for `chat` -> `id` in the response

**Praeco Configuration**:
- **Room ID**: Chat ID for the target channel/group (required, format: `-xxxxxxxx`)
- **Proxy**: Network proxy in format `hostname:port` (optional)
- **Proxy Login**: Proxy authentication username
- **Proxy Password**: Proxy authentication password
- **Parse Mode**: Message formatting (markdown, markdownV2, html)
- **Thread ID**: For supergroup/forum threads

**Best Practices**:
- Use markdown for formatted messages
- Create separate channels for different alert priorities
- Use thread ID for organized discussions in forums
- Test with personal chat before production deployment

### HTTP POST / HTTP POST 2

**Purpose**: Send alerts to custom webhooks or APIs

**HTTP POST** (Simple):
- Basic authentication support
- Simpler configuration
- Good for straightforward webhook integrations

**HTTP POST 2** (Advanced):
- Full HTTP method control (GET, POST, PUT, DELETE, etc.)
- Custom headers
- Advanced timeout and retry settings
- Better for complex API integrations

**Praeco Configuration (HTTP POST)**:
- **HTTP POST URL**: Target webhook URL (required)
- **HTTP POST Payload**: JSON payload template
- **HTTP POST Static Payload**: Fixed fields always sent
- **HTTP POST All Values**: Include all matched values
- **HTTP POST Timeout**: Request timeout in seconds
- **HTTP POST CA Certs**: SSL certificate validation
- **HTTP Post Proxy**: HTTP proxy URL

**Praeco Configuration (HTTP POST 2)**:
- **HTTP POST2 URL**: Target URL (required)
- **HTTP POST2 Method**: HTTP method (GET, POST, PUT, DELETE, etc.)
- **HTTP POST2 Headers**: Custom HTTP headers (JSON format)
- **HTTP POST2 Payload**: Request body template
- **HTTP POST2 Timeout**: Request timeout
- **HTTP POST2 CA Certs**: SSL certificates

> **⚠️ Security Warning**: The "Ignore SSL Errors" option should **never** be used in production. Disabling SSL verification exposes your system to man-in-the-middle attacks. Always provide proper CA certificates instead.

**Example Payload**:
```json
{
  "alert_name": "{rule_name}",
  "severity": "high",
  "message": "{message}",
  "timestamp": "{@timestamp}",
  "host": "{host}"
}
```

**Best Practices**:
- Validate webhook endpoints before deployment
- Use POST2 for RESTful APIs requiring specific methods
- Include authentication tokens in headers, not URLs
- Set appropriate timeouts to avoid blocking
- Test with tools like RequestBin or webhook.site first
- Monitor webhook response codes

**Troubleshooting**:
- Connection errors: Verify URL and network connectivity
- 401/403 errors: Check authentication credentials
- Timeout: Increase timeout or check endpoint performance
- SSL errors: Verify certificates or test with proper CA certificates in an isolated development environment

### Jira

**Purpose**: Create Jira tickets when alerts fire

**Prerequisites**:
1. Jira account with API access
2. API token or password
3. Project key and issue type

**BaseRule.config setup**:
```yaml
jira_server: 'https://your-domain.atlassian.net'
jira_account_file: '/opt/elastalert/jira/jira_auth.yaml'
```

**Jira Auth File** (`jira_auth.yaml`):
```yaml
user: your-email@example.com
password: your-api-token-or-password
```

**Praeco Configuration**:
- **Jira Project**: Jira project key (required)
- **Jira Issue Type**: Issue type name (e.g., Bug, Task)
- **Jira Components**: Component names (comma-separated)
- **Jira Labels**: Labels for the issue (comma-separated)
- **Jira Priority**: Issue priority
- **Jira Assignee**: Assignee username
- **Jira Watchers**: Watchers (comma-separated)
- **Jira Bump Tickets**: Update existing tickets instead of creating new ones
- **Jira Bump In Statuses**: Statuses where tickets can be updated

**Best Practices**:
- Use components to route to teams
- Set appropriate priorities
- Use labels for categorization
- Enable bump tickets to avoid duplicate issues
- Include links to logs in description
- Use custom fields for additional context

**Troubleshooting**:
- Authentication failed: Check credentials in auth file
- Project not found: Verify project key
- Permission denied: Ensure user has create issue permission
- Invalid issue type: Check available types in your project

### PagerDuty

**Purpose**: Create incidents in PagerDuty for on-call escalation

**Prerequisites**:
1. PagerDuty account
2. Integration key from PagerDuty service

**BaseRule.config setup**:
```yaml
pagerduty_service_key: 'YOUR_SERVICE_KEY'
```

**Praeco Configuration**:
- **PagerDuty Service Key**: Integration key (required, can override BaseRule.config)
- **PagerDuty Client Name**: Client name for the event
- **PagerDuty Event Type**: trigger, acknowledge, or resolve
- **PagerDuty Incident Key**: Unique key for incident grouping
- **PagerDuty Incident Key Args**: Fields to use in incident key
- **PagerDuty API Version**: v1 or v2
- **PagerDuty V2 Payload Class**: Class field for v2 API
- **PagerDuty V2 Payload Component**: Component field for v2 API
- **PagerDuty V2 Payload Group**: Group field for v2 API
- **PagerDuty V2 Payload Severity**: Severity (critical, error, warning, info)
- **PagerDuty V2 Payload Source**: Source field for v2 API

**Best Practices**:
- Use API v2 for new integrations
- Set appropriate severity levels
- Use incident keys to group related alerts
- Include context in summary and details
- Test with low-priority service first
- Configure auto-resolution when alerts clear

**Troubleshooting**:
- Invalid API key: Check service key in BaseRule.config
- Incident not created: Verify event type is "trigger"
- Duplicate incidents: Use consistent incident keys

### Google Chat

**Purpose**: Send notifications to Google Chat spaces

**Prerequisites**:
1. Google Workspace account
2. Google Chat webhook URL

**Praeco Configuration**:
- **Google Chat Webhook URL**: Incoming webhook URL (required)
- **Google Chat Format**: Message format (basic, card)
- **Google Chat Header Title**: Card header title
- **Google Chat Header Subtitle**: Card header subtitle
- **Google Chat Header Image**: Image URL for card header

**Best Practices**:
- Use card format for rich formatting
- Include header images for visual identification
- Test with test space before production

### Mattermost

**Purpose**: Send notifications to Mattermost channels

**Prerequisites**:
1. Mattermost server
2. Incoming webhook URL

**BaseRule.config setup**:
```yaml
mattermost_webhook_url: 'https://your-mattermost-server/hooks/YOUR_WEBHOOK_ID'
```

**Praeco Configuration**:
- **Mattermost Webhook URL**: Can override BaseRule.config
- **Mattermost Username Override**: Custom username for bot
- **Mattermost Channel Override**: Target channel (e.g., `#alerts`)
- **Mattermost Icon URL Override**: Custom icon URL
- **Mattermost Msg Color**: Message color (good, warning, danger, hex)
- **Mattermost Proxy**: HTTP proxy if needed

**Best Practices**:
- Use color coding for severity
- Route to appropriate channels
- Set descriptive usernames

### Discord

**Purpose**: Send notifications to Discord channels

**Prerequisites**:
1. Discord server admin access
2. Webhook URL from channel settings

**Praeco Configuration**:
- **Discord Webhook URL**: Channel webhook URL (required)
- **Discord Emoji Title**: Emoji for message title
- **Discord Embed Footer**: Footer text
- **Discord Embed Icon URL**: Icon URL for embed

**Best Practices**:
- Use embeds for formatted messages
- Include emoji for visual identification
- Set up separate webhooks for different alert types

### Rocket.Chat

**Purpose**: Send notifications to Rocket.Chat channels

**Prerequisites**:
1. Rocket.Chat server
2. Incoming webhook URL

**BaseRule.config setup**:
```yaml
rocket_chat_webhook_url: 'https://your-rocketchat-server/hooks/YOUR_WEBHOOK_ID'
```

**Praeco Configuration**:
- **Rocket.Chat Webhook URL**: Can override BaseRule.config
- **Rocket.Chat Username Override**: Custom username
- **Rocket.Chat Channel Override**: Target channel
- **Rocket.Chat Emoji Override**: Custom emoji
- **Rocket.Chat Msg Color**: Message color

### AWS SNS (Simple Notification Service)

**Purpose**: Publish alerts to AWS SNS topics

**Prerequisites**:
1. AWS account
2. SNS topic ARN
3. AWS credentials with SNS publish permissions

**BaseRule.config setup**:
```yaml
sns_topic_arn: 'arn:aws:sns:region:account-id:topic-name'
aws_access_key_id: 'YOUR_ACCESS_KEY'
aws_secret_access_key: 'YOUR_SECRET_KEY'
aws_region: 'us-east-1'
```

**Praeco Configuration**:
- **SNS Topic ARN**: Target SNS topic (required)
- **SNS AWS Access Key ID**: AWS access key
- **SNS AWS Secret Access Key**: AWS secret key
- **SNS AWS Region**: AWS region
- **SNS AWS Profile**: AWS CLI profile name

**Best Practices**:
- Use IAM roles instead of access keys when possible
- Set up SNS subscriptions for email, SMS, Lambda, etc.
- Use separate topics for different alert priorities
- Enable CloudWatch metrics for monitoring

### AWS SES (Simple Email Service)

**Purpose**: Send emails via AWS SES

**Prerequisites**:
1. AWS account
2. Verified sender email address in SES
3. AWS credentials with SES send permissions

**BaseRule.config setup**:
```yaml
ses_from_addr: 'alerts@example.com'
aws_access_key_id: 'YOUR_ACCESS_KEY'
aws_secret_access_key: 'YOUR_SECRET_KEY'
aws_region: 'us-east-1'
```

**Praeco Configuration**:
- **SES From Address**: Verified sender email (required)
- **SES To Address**: Recipient email addresses
- **SES AWS Access Key ID**: AWS access key
- **SES AWS Secret Access Key**: AWS secret key
- **SES AWS Region**: AWS region
- **SES AWS Profile**: AWS CLI profile name
- **SES Email Add Domain**: Include @domain in addresses

**Best Practices**:
- Verify sender and recipient addresses in SES
- Monitor sending limits and quotas
- Use SES for high-volume email alerting
- Set up bounce and complaint handling

### Opsgenie

**Purpose**: Create alerts in Opsgenie for incident management

**Prerequisites**:
1. Opsgenie account
2. API key

**BaseRule.config setup**:
```yaml
opsgenie_key: 'YOUR_API_KEY'
```

**Praeco Configuration**:
- **Opsgenie Key**: API key (required)
- **Opsgenie Account**: Opsgenie account name
- **Opsgenie Recipients**: Recipients (comma-separated)
- **Opsgenie Teams**: Team names (comma-separated)
- **Opsgenie Tags**: Tags for alerts (comma-separated)
- **Opsgenie Priority**: P1 to P5
- **Opsgenie Alias**: Unique identifier for alert
- **Opsgenie Entity**: Entity field
- **Opsgenie Proxy**: HTTP proxy if needed

**Best Practices**:
- Use teams for routing
- Set appropriate priorities
- Use tags for categorization
- Configure alias for alert deduplication

### TheHive

**Purpose**: Create alerts/cases in TheHive security platform

**Prerequisites**:
1. TheHive instance
2. API key with alert creation permissions

**BaseRule.config setup**:
```yaml
hive_connection:
  hive_host: http://localhost
  hive_port: 9000
  hive_apikey: YOUR_API_KEY
  hive_proxies:
    http: ''
    https: ''
```

**Praeco Configuration**:
- Set `hive_alert_config` options in Praeco UI
- **Note**: `hive_observable_data_mapping` is not supported in Praeco

**Best Practices**:
- Include observables for IOC tracking
- Set appropriate severity and TLP
- Use tags for categorization
- Link to source logs

### Datadog

**Purpose**: Send events to Datadog

**Prerequisites**:
1. Datadog account
2. API key

**BaseRule.config setup**:
```yaml
datadog_api_key: 'YOUR_API_KEY'
```

**Praeco Configuration**:
- **Datadog API Key**: Can override BaseRule.config
- **Datadog App Key**: Application key

**Best Practices**:
- Use events for correlation with metrics
- Include relevant tags
- Link to dashboards

### Alertmanager (Prometheus)

**Purpose**: Send alerts to Prometheus Alertmanager

**Prerequisites**:
1. Prometheus Alertmanager instance
2. Network access to Alertmanager

**Praeco Configuration**:
- **Alertmanager URL**: Alertmanager host URL (required)
- **Alertmanager Timeout**: Request timeout
- **Alertmanager CA Certs**: CA certificates for SSL verification

> **⚠️ Security Warning**: Disabling SSL verification (if available) is **strongly discouraged**. Always use proper CA certificates to prevent man-in-the-middle attacks.
- **Alertmanager Proxy**: HTTP proxy
- **Alertmanager Alert Subject Args**: Fields for labels
- **Alertmanager Alert Text Args**: Fields for annotations

**Best Practices**:
- Use consistent label names
- Configure routing in Alertmanager
- Include runbook URLs in annotations

### Twilio

**Purpose**: Send SMS or voice alerts via Twilio

**Prerequisites**:
1. Twilio account
2. Twilio phone number
3. Account SID and Auth Token

**BaseRule.config setup**:
```yaml
twilio_account_sid: 'YOUR_ACCOUNT_SID'
twilio_auth_token: 'YOUR_AUTH_TOKEN'
twilio_from_number: '+1234567890'
```

**Praeco Configuration**:
- **Twilio Account SID**: Can override BaseRule.config
- **Twilio Auth Token**: Can override BaseRule.config
- **Twilio From Number**: Sender phone number (required)
- **Twilio To Number**: Recipient phone number (required)

**Best Practices**:
- Reserve for critical alerts only (costs per SMS)
- Test with your number first
- Keep messages concise (SMS length limits)
- Consider rate limits and costs

### Command

**Purpose**: Execute shell commands when alerts fire

> **⚠️ CRITICAL SECURITY WARNING ⚠️**
> 
> Command execution presents **severe security risks** including:
> - **Remote Code Execution (RCE)** vulnerabilities
> - **Privilege escalation** if running with elevated permissions
> - **System compromise** through shell injection attacks
> 
> **ONLY use this alert type if absolutely necessary**. Consider alternatives like:
> - HTTP POST webhooks to trigger automation
> - Message queue integrations (STOMP, SNS)
> - Dedicated incident management tools (PagerDuty, Opsgenie)
> 
> If you must use Command alerting:
> - Never include user-controlled or untrusted data in commands
> - Use absolute paths and parameter validation
> - Run with minimal required permissions (never as root)
> - Implement extensive logging and monitoring
> - Conduct security reviews of all command configurations

**Praeco Configuration**:
- **Command**: Shell command to execute (required)
- **Pipe Match JSON**: Pipe match data as JSON to stdin
- **Pipe Alert Text**: Pipe alert text to stdin

**Examples**:
```bash
# Restart a service
/usr/local/bin/restart-service.sh

# Send notification via custom script
/opt/scripts/notify.py --severity high --message "Alert fired"

# Log to file
echo "Alert: $(date)" >> /var/log/praeco-alerts.log
```

**Best Practices**:
- Use absolute paths for commands
- Test commands manually first
- Implement proper error handling
- Log command execution and results
- Use dedicated service accounts with minimal permissions
- Never expose command parameters to users

**Security Considerations**:
- Validate all inputs
- Avoid shell injection vulnerabilities
- Use allowlists for command paths
- Run with minimal required permissions
- Monitor command execution logs

### Dingtalk

**Purpose**: Send notifications to DingTalk (popular in China)

**Prerequisites**:
1. DingTalk webhook URL
2. Optional: Secret for signature verification

**Praeco Configuration**:
- **Dingtalk Access Token**: Webhook access token (required)
- **Dingtalk Secret**: Secret key for signature
- **Dingtalk MsgType**: text or markdown

**Best Practices**:
- Use markdown for formatted messages
- Enable secret for security
- Test in development group first

### Lark (Feishu)

**Purpose**: Send notifications to Lark/Feishu (ByteDance's collaboration tool)

**Prerequisites**:
1. Lark webhook URL

**Praeco Configuration**:
- **Lark Bot URL**: Webhook URL (required)
- **Lark MsgType**: text, post, or interactive

**Best Practices**:
- Use post or interactive for rich content
- Include at mentions for important alerts

### WorkWeChat (企业微信)

**Purpose**: Send notifications to WeChat Work (enterprise WeChat in China)

**Prerequisites**:
1. WeChat Work account
2. Application credentials

**Praeco Configuration**:
- Configure WorkWeChat application details in Praeco

**Best Practices**:
- Use for Chinese enterprise deployments
- Test message formatting
- Comply with WeChat Work policies

### Chatwork

**Purpose**: Send notifications to Chatwork (popular in Japan)

**Prerequisites**:
1. Chatwork account
2. API token
3. Room ID

**Praeco Configuration**:
- **Chatwork Room ID**: Target room (required)
- **Chatwork API Token**: Authentication token (required)
- **Chatwork Proxy**: HTTP proxy if needed

**Best Practices**:
- Use dedicated rooms for alerts
- Include @mentions for critical alerts

### LINE Message API

**Purpose**: Send notifications via LINE messenger (popular in Asia)

**Prerequisites**:
1. LINE Messaging API account
2. Channel access token
3. User ID or group ID

**Praeco Configuration**:
- **LINE Access Token**: Channel access token (required)
- **LINE To User ID**: Target user or group ID (required)

**Best Practices**:
- Test with personal account first
- Use groups for team alerts
- Respect messaging limits

### Graylog GELF

**Purpose**: Send logs to Graylog via GELF protocol

**Prerequisites**:
1. Graylog server
2. GELF input configured

**Praeco Configuration**:
- **GELF Host**: Graylog server hostname (required)
- **GELF Port**: GELF input port (required)
- **GELF Type**: TCP or UDP
- **GELF Log Level**: Log level

**Best Practices**:
- Use TCP for reliable delivery
- Set appropriate log levels
- Include structured data
- Configure GELF input in Graylog first

### Alerta

**Purpose**: Send alerts to Alerta for consolidation

**Prerequisites**:
1. Alerta server
2. API key (if authentication enabled)

**Praeco Configuration**:
- **Alerta URL**: Alerta API URL (required)
- **Alerta API Key**: Authentication key
- **Alerta Environment**: Environment name (required)
- **Alerta Service**: Service names (comma-separated, required)
- **Alerta Resource**: Resource identifier (required)
- **Alerta Event**: Event type (required)
- **Alerta Group**: Alert group
- **Alerta Severity**: Severity level
- **Alerta Tags**: Tags (comma-separated)
- **Alerta Timeout**: Alert timeout

**Best Practices**:
- Use consistent service and resource names
- Set appropriate severities
- Include relevant tags
- Configure environment names properly

### IRIS

**Purpose**: Send alerts to IRIS incident response platform

**Prerequisites**:
1. IRIS instance
2. API credentials

**Praeco Configuration**:
- **IRIS URL**: IRIS API URL (required)
- **IRIS API Key**: Authentication key (required)
- **IRIS Customer ID**: Customer identifier
- **IRIS Case Template**: Template ID

**Best Practices**:
- Use templates for consistency
- Include all relevant context
- Link to source data

### Matrix Hookshot

**Purpose**: Send notifications to Matrix rooms via Hookshot bot

**Prerequisites**:
1. Matrix homeserver
2. Hookshot bot configured
3. Webhook URL from room

**Praeco Configuration**:
- **Matrix Hookshot URL**: Webhook URL (required)
- **Matrix Hookshot Username**: Bot display name

**Best Practices**:
- Use encryption for sensitive alerts
- Test in private room first

### MS Power Automate

**Purpose**: Trigger Microsoft Power Automate flows

**Prerequisites**:
1. Microsoft 365 account
2. Power Automate flow with HTTP trigger
3. Flow webhook URL

**Praeco Configuration**:
- **Power Automate URL**: Flow trigger URL (required)
- **Power Automate Proxy**: HTTP proxy if needed

**Best Practices**:
- Use flows for complex automation
- Include authentication in flow
- Test flow logic separately
- Monitor flow runs

### Webex

**Purpose**: Send notifications to Webex Teams rooms

**Prerequisites**:
1. Webex account
2. Incoming webhook URL

**Praeco Configuration**:
- **Webex Webhook URL**: Room webhook URL (required)
- **Webex Message Markdown**: Use markdown formatting

**Best Practices**:
- Use markdown for rich formatting
- Create dedicated alert rooms

### Zabbix

**Purpose**: Send alerts to Zabbix monitoring system

**Prerequisites**:
1. Zabbix server
2. Zabbix sender configured

**Praeco Configuration**:
- **Zabbix Server**: Zabbix server hostname (required)
- **Zabbix Port**: Zabbix port (default: 10051)
- **Zabbix Host**: Monitored host name in Zabbix (required)
- **Zabbix Item Key**: Zabbix item key (required)

**Best Practices**:
- Configure items in Zabbix first
- Use consistent host names
- Test with Zabbix sender tool

### Stomp

**Purpose**: Send messages via STOMP protocol (message queues)

**Prerequisites**:
1. STOMP-compatible message broker
2. Connection credentials

**Praeco Configuration**:
- **Stomp Hostname**: Broker hostname (required)
- **Stomp Port**: Broker port (required)
- **Stomp Login**: Authentication username
- **Stomp Password**: Authentication password
- **Stomp Destination**: Queue/topic destination (required)

**Best Practices**:
- Use persistent connections
- Configure acknowledgments
- Monitor queue depth

### Splunk On-Call (VictorOps)

**Purpose**: Create incidents in Splunk On-Call

**Prerequisites**:
1. Splunk On-Call account
2. API key and routing key

**BaseRule.config setup**:
```yaml
victorops_api_key: 'YOUR_API_KEY'
victorops_routing_key: 'YOUR_ROUTING_KEY'
```

**Praeco Configuration**:
- **VictorOps API Key**: Can override BaseRule.config
- **VictorOps Routing Key**: Can override BaseRule.config
- **VictorOps Message Type**: CRITICAL, WARNING, INFO
- **VictorOps Entity ID**: Unique identifier
- **VictorOps Entity Display Name**: Display name

**Best Practices**:
- Use routing keys for team routing
- Set appropriate message types
- Use consistent entity IDs for deduplication

### ServiceNow

**Purpose**: Create incidents in ServiceNow

**Prerequisites**:
1. ServiceNow instance
2. API credentials
3. Assignment group configured

**BaseRule.config setup**:
```yaml
servicenow_rest_url: 'https://your-instance.service-now.com'
servicenow_username: 'YOUR_USERNAME'
servicenow_password: 'YOUR_PASSWORD'
```

**Praeco Configuration**:
- **ServiceNow REST URL**: Instance URL (required)
- **ServiceNow Username**: Authentication username
- **ServiceNow Password**: Authentication password
- **ServiceNow Short Description**: Incident title
- **ServiceNow Comments**: Incident description
- **ServiceNow Assignment Group**: Target group
- **ServiceNow Category**: Incident category
- **ServiceNow Subcategory**: Incident subcategory
- **ServiceNow Impact**: Impact level (1-3)
- **ServiceNow Urgency**: Urgency level (1-3)

**Best Practices**:
- Use assignment groups for routing
- Set appropriate impact and urgency
- Include detailed descriptions
- Link to source data

### PagerTree

**Purpose**: Create incidents in PagerTree

**Prerequisites**:
1. PagerTree account
2. Integration URL

**Praeco Configuration**:
- **PagerTree Integration URL**: Integration endpoint (required)

**Best Practices**:
- Configure escalation policies in PagerTree
- Test with low-priority alerts first

### Exotel

**Purpose**: Send voice alerts via Exotel (India-based telephony)

**Prerequisites**:
1. Exotel account
2. API credentials

**Praeco Configuration**:
- **Exotel Account SID**: Account identifier (required)
- **Exotel Auth Token**: Authentication token (required)
- **Exotel From Number**: Caller ID number (required)
- **Exotel To Number**: Recipient number (required)

**Best Practices**:
- Use for critical alerts only
- Test with known numbers
- Check local regulations
- Monitor costs

### Tencent SMS

**Purpose**: Send SMS via Tencent Cloud (China)

**Prerequisites**:
1. Tencent Cloud account
2. SMS service enabled
3. App ID and App Key

**Praeco Configuration**:
- **Tencent App ID**: Application ID (required)
- **Tencent App Key**: Application key (required)
- **Tencent Sign**: SMS signature (required)
- **Tencent Template ID**: Template ID (required)
- **Tencent Phone Numbers**: Recipient numbers (required)

**Best Practices**:
- Create templates in Tencent console first
- Test with verified numbers
- Monitor sending quotas

### YZJ

**Purpose**: Custom alerting platform integration

**Praeco Configuration**:
- **YZJ Webhook URL**: Target URL (required)

**Note**: Limited documentation available. Configure based on YZJ platform requirements.

### Flashduty

**Purpose**: Create incidents in Flashduty incident management

**Prerequisites**:
1. Flashduty account
2. Integration key

**Praeco Configuration**:
- **Flashduty Integration Key**: Authentication key (required)

**Best Practices**:
- Configure routing policies in Flashduty
- Set up escalation chains
- Test with development environment

## Testing Alerts

Before deploying alerts to production:

1. **Use Test Button**: Praeco provides a test button in the rule editor
   - Tests the rule query against historical data
   - Shows if matches would be found
   - Displays sample alert content
   - **Note**: If no matches are found, this doesn't mean the rule is broken - it may simply indicate no matching events exist in the test timeframe. Try adjusting the time range or creating test events.

2. **Test Configurations**:
   - Create a test channel/room/email for each alert type
   - Verify formatting and content
   - Check links and attachments

3. **Validate Time Ranges**:
   - Ensure query time range matches alert frequency
   - Test with different time periods
   - Verify aggregation windows

4. **Check Alert Volume**:
   - Estimate expected alert frequency
   - Configure re-alert appropriately
   - Set up aggregation if needed

5. **Monitor First Runs**:
   - Watch error logs after deployment
   - Verify alerts arrive as expected
   - Adjust thresholds if needed

## Troubleshooting Common Issues

### Alerts Not Sending

**Symptoms**: Rule triggers but no notifications received

**Possible Causes**:
1. **Credentials Issue**:
   - Check BaseRule.config for correct API keys/tokens
   - Verify authentication files exist and are readable
   - Test credentials manually with curl/API client

2. **Network Issue**:
   - Check firewall rules
   - Verify DNS resolution
   - Test connectivity with curl/ping

3. **Configuration Error**:
   - Check ElastAlert error logs
   - Verify all required fields are set
   - Test with minimal configuration first

4. **Rate Limiting**:
   - Check if hitting API rate limits
   - Review re-alert settings
   - Check alert aggregation

**Debug Steps**:

For Docker deployments:
```bash
# First, find your container names
docker ps

# Check ElastAlert logs (container name may vary, common names: elastalert-server, elastalert)
docker logs elastalert-server

# Check Praeco logs (container name may vary, common names: praeco, webapp)
docker logs praeco

# Test rule manually inside container
docker exec -it elastalert-server elastalert-test-rule --config /opt/elastalert/config.yaml /opt/elastalert/rules/your-rule.yaml
```

For non-Docker deployments:
```bash
# Check ElastAlert logs (location may vary)
tail -f /var/log/elastalert/elastalert.log

# Test rule manually
elastalert-test-rule --config /etc/elastalert/config.yaml /etc/elastalert/rules/your-rule.yaml
```

### Incorrect Alert Content

**Symptoms**: Alerts send but content is wrong

**Possible Causes**:
1. **Field Names**:
   - Verify field names exist in Elasticsearch
   - Check field name spelling
   - Use Kibana Discover to confirm fields

2. **Template Variables**:
   - Check alert_subject_args order
   - Verify field references ({0}, {1}, etc.)
   - Test with static content first

3. **Formatting**:
   - Check markdown/HTML syntax
   - Verify destination supports formatting
   - Test with plain text first

### High Alert Volume

**Symptoms**: Too many alerts, alert fatigue

**Solutions**:
1. **Adjust Thresholds**:
   - Increase thresholds to reduce noise
   - Use statistical baselines
   - Implement percentage changes instead of absolute

2. **Use Aggregation**:
   - Batch multiple alerts together
   - Set aggregation schedule
   - Group by relevant fields

3. **Implement Re-alert**:
   - Set appropriate re-alert intervals
   - Use per-group re-alert
   - Consider exponential backoff

4. **Filter False Positives**:
   - Add query filters for known good patterns
   - Use blacklists for expected events
   - Implement maintenance windows

### SSL/TLS Errors

**Symptoms**: Connection failures with SSL errors

**Solutions**:
1. **Certificate Verification**:
   - Provide proper CA certificates for verification
   - Check certificate expiration dates
   - Verify certificate chain is complete
   
   > **Security Note**: Never disable SSL verification in production environments. This exposes you to man-in-the-middle attacks. If you must test connectivity, use isolated development environments only.

2. **Hostname Mismatch**:
   - Use correct hostname in URL
   - Check certificate CN/SAN fields
   - Use IP address if hostname not in cert

3. **Protocol Version**:
   - Ensure server supports TLS 1.2+
   - Check for deprecated protocols
   - Update client libraries

## Best Practices

### General

1. **Start Simple**:
   - Begin with basic configurations
   - Test thoroughly before adding complexity
   - Document your configurations

2. **Use BaseRule.config**:
   - Store API keys and tokens centrally
   - Avoid secrets in individual rules
   - Use environment variables for sensitive data

3. **Test Everything**:
   - Test in development first
   - Use test channels/addresses
   - Validate with historical data

4. **Monitor Alert Health**:
   - Check ElastAlert error logs regularly
   - Monitor alert delivery rates
   - Track failed deliveries

5. **Document Runbooks**:
   - Include troubleshooting steps in alerts
   - Link to relevant documentation
   - Provide clear next steps

### Alert Content

1. **Be Specific**:
   - Include relevant field values
   - Provide context (what, when, where)
   - Link to source data

2. **Use Formatting**:
   - Format for readability
   - Use colors/icons for severity
   - Structure information logically

3. **Include Actions**:
   - Suggest remediation steps
   - Link to runbooks
   - Provide acknowledgment instructions

4. **Keep It Concise**:
   - Subject lines should be scannable
   - Summarize in first line
   - Details in body/attachments

### Alert Routing

1. **Use Multiple Channels**:
   - Critical: PagerDuty, SMS, voice calls
   - High: Slack, MS Teams, email
   - Medium: Email, chat
   - Low: Log aggregation only

2. **Route by Team**:
   - Use channels/rooms per team
   - Configure routing in destination system
   - Include team identifiers in alerts

3. **Escalate Appropriately**:
   - Define escalation paths
   - Use tiered alerting
   - Implement acknowledgment

### Performance

1. **Optimize Queries**:
   - Use specific indices
   - Limit time ranges
   - Use filters effectively
   - Enable use_count_query for large datasets

2. **Manage Alert Volume**:
   - Use aggregation
   - Set re-alert intervals
   - Implement rate limiting

3. **Monitor Resources**:
   - Check ElastAlert CPU/memory
   - Monitor Elasticsearch load
   - Review rule execution times

## Security Considerations

### Credential Management

1. **Never Commit Secrets**:
   - Use BaseRule.config (add to .gitignore)
   - Use environment variables
   - Use secret management tools

2. **Rotate Regularly**:
   - Rotate API keys periodically
   - Update authentication tokens
   - Review access permissions

3. **Limit Permissions**:
   - Use least privilege principle
   - Create dedicated service accounts
   - Audit access regularly

### Data Sensitivity

1. **Sanitize Alert Content**:
   - Avoid including PII in alerts
   - Mask sensitive data
   - Use secure channels for sensitive alerts

2. **Secure Communications**:
   - Use HTTPS/TLS for webhooks
   - Enable SSL for SMTP
   - Verify certificates

3. **Access Control**:
   - Limit who can create/modify rules
   - Use Praeco authentication if available
   - Audit rule changes

### Command Execution

1. **Avoid User Input**:
   - Never use unsanitized data in commands
   - Use allowlists for commands
   - Validate all parameters

2. **Minimize Privileges**:
   - Run with minimal permissions
   - Use dedicated service accounts
   - Avoid running as root

3. **Audit and Log**:
   - Log all command executions
   - Monitor for suspicious activity
   - Review logs regularly

## Maintenance

### Regular Tasks

1. **Review Alert Effectiveness**:
   - Check if alerts lead to action
   - Identify false positives
   - Tune thresholds

2. **Update Credentials**:
   - Rotate API keys/tokens
   - Update SSL certificates
   - Review access permissions

3. **Monitor Alert Health**:
   - Check delivery rates
   - Review error logs
   - Test alert paths

4. **Documentation**:
   - Keep runbooks updated
   - Document configuration changes
   - Update team contacts

### Troubleshooting Checklist

When alerts fail:

- [ ] Check ElastAlert error logs
- [ ] Verify Elasticsearch connectivity
- [ ] Test credentials manually
- [ ] Check network connectivity to destination
- [ ] Verify all required fields are configured
- [ ] Test with minimal configuration
- [ ] Review recent configuration changes
- [ ] Check rate limits and quotas
- [ ] Verify SSL/TLS certificates
- [ ] Test query returns results

## Additional Resources

### Documentation Links

- [ElastAlert 2 Documentation](https://elastalert2.readthedocs.io/)
- [ElastAlert 2 Alert Types](https://elastalert2.readthedocs.io/en/latest/ruletypes.html)
- [Praeco GitHub](https://github.com/johnsusek/praeco)
- [Praeco Wiki](https://github.com/johnsusek/praeco/wiki)

### Community Resources

- [Praeco Issues](https://github.com/johnsusek/praeco/issues)
- [ElastAlert 2 Alerts Support Status](https://github.com/johnsusek/praeco/wiki/ElastAlert-2-Alerts-support-status)

### Related Guides

- [README.md](README.md) - Main Praeco documentation
- [UPGRADING.md](UPGRADING.md) - Version upgrade instructions
- [MAINTENANCE.md](MAINTENANCE.md) - Maintenance procedures

## Conclusion

This guide has covered the configuration and implementation of all alert types supported by Praeco. Key takeaways:

1. **Start with BaseRule.config**: Configure shared credentials centrally
2. **Test Thoroughly**: Always test in development before production
3. **Keep It Simple**: Start with basic configurations and add complexity gradually
4. **Monitor and Iterate**: Review alert effectiveness and tune regularly
5. **Document Everything**: Keep runbooks and configurations documented
6. **Security First**: Protect credentials and sanitize data

For specific alert type questions or issues:
1. Check this guide for configuration details
2. Review the README.md troubleshooting section
3. Consult ElastAlert 2 documentation
4. Search Praeco GitHub issues
5. Check the Praeco wiki

Remember: The best alerts are actionable, specific, and arrive through appropriate channels for their severity. Happy alerting! 🚀
