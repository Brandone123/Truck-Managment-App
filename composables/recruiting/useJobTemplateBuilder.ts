/**
 * DYNAMIC HTML GENERATION FOR PREVIEW
 * We'll build a small helper to parse each item in `currentJobTemplate.value.fields_definition` 
 * into an HTML string. Then we store it in `currentJobTemplate.value.html`.
 */
export function buildHtml(data: Record<string, any>[]): string {
    let html = '';
    const chipStyle = "border-radius: 5px; padding: 4px; background-color: rgb(187, 187, 187);color: rgb(255, 255, 255);"

    data.forEach((item) => {
        // For default sections, we format them in a more structured way:
        if (item.default) {
            switch (item.title) {
                case 'general':
                    html += `
              <p><strong class="ql-size-huge">${item.data.job_title || ''}</strong></p>
            `;

                    const jobDetails = ['job_type', 'pay', 'shifts_and_schedules', 'trucking_details']
                    if (jobDetails.some(detail => item.data[detail].display)) {
                        html += "<h1><u>Job Details</u></h1>"

                        // Job Type
                        if (item.data.job_type.display) {
                            html += `<p style="padding-top: 5px; padding-bottom:5px;"><strong class="ql-size-large">Job Type: </strong><span class="ql-size-large"> ${item.data.job_type.value.type}`
                            if (item.data.job_type.value.type == 'contract' && item.data.job_type.value.contract_time == 'variable') {
                                html += ` (${item.data.job_type.value.contract_time_from} ${item.data.job_type.value.contract_time_from_duration} to ${item.data.job_type.value.contract_time_to} ${item.data.job_type.value.contract_time_to_duration})`
                            }
                            else if (item.data.job_type.value.type == 'contract' && item.data.job_type.value.contract_time == 'fixed') {
                                html += ` (${item.data.job_type.value.contract_time_fixed} ${item.data.job_type.value.contract_duration})`
                            }

                            html += `</span></p>`
                        }


                        // Pay
                        if (item.data.pay.display) {
                            if (item.data.pay.value.type === 'range') {
                                html += `<p style="padding-top: 5px; padding-bottom:5px;"><strong class="ql-size-large">Pay: </strong><span class="ql-size-large"> $${item.data.pay.value.pay_range_from || 0} / ${item.data.pay.value.category || ''} - $${item.data.pay.value.pay_range_to || 0} / ${item.data.pay.value.category || ''}</span></p>`;
                            } else if (item.data.pay.value.type === 'fixed') {
                                html += `<p style="padding-top: 5px; padding-bottom:5px;"><strong class="ql-size-large">Pay: </strong><span class="ql-size-large"> $${item.data.pay.value.fixed_pay || 0} / ${item.data.pay.value.category || ''}</span></p>`;
                            }
                        }

                        // Shift and schedules
                        if (item.data.shifts_and_schedules.display) {
                            html += `<p style="padding-top: 5px; padding-bottom:5px;"><strong class="ql-size-large">Shifts And Schedules: </strong><span class="ql-size-large">`
                            item.data.shifts_and_schedules.value.forEach((shiftEntry: string) => {
                                html += `<span style="${chipStyle}">${shiftEntry}</span>&nbsp;&nbsp;`
                            })
                            html += `</span></p>`
                        }

                        // Trucking Details
                        if (item.data.trucking_details.display) {
                            html += `<p style="padding-top: 5px; padding-bottom:5px;"><strong class="ql-size-large">Trucking Details: </strong><span class="ql-size-large">`
                            item.data.trucking_details.value.forEach((truckingDetailsEntry: string) => {
                                html += `<span style="${chipStyle}">${truckingDetailsEntry}</span>&nbsp;&nbsp;`
                            })
                            html += `</span></p>`
                        }

                    }
                    break;

                case 'opportunity':
                    html += `
                  <p><strong>Opportunity:</strong> ${item.data.type || ''} </p>
                `;
                    // If contract, show contract info
                    if (item.data.type === 'contract') {
                        if (item.data.contract_time === 'fixed') {
                            html += `
                  <p><strong>Contract Duration:</strong> ${item.data.contract_time_fixed || ''} 
                    ${item.data.contract_duration || ''}</p>
                `;
                        } else if (item.data.contract_time === 'variable') {
                            html += `
                  <p><strong>Contract Length:</strong> 
                    From ${item.data.contract_time_from || ''} ${item.data.contract_time_from_duration || ''} 
                    to ${item.data.contract_time_to || ''} ${item.data.contract_time_to_duration || ''}
                  </p>
                `;
                        }
                    }
                    break;

                case 'locations': {
                    if (item.data?.length) {
                        html += `<h1><u>Location${(item.data.length || 0) > 1 ? 's' : ''}</u></h1>`;
                        if (Array.isArray(item.data) && item.data.length) {
                            // Start location list
                            html += `<div><ol>`;
                            item.data.forEach((loc: any) => {
                                const city = loc.city || '';
                                const state = loc.state || '';
                                const country = loc.country || '';
                                const jobType = loc.job_type ? `(${loc.job_type})` : '';

                                // Join only the non-empty fields with commas
                                const locationParts = [city, state, country].filter(Boolean).join(', ');

                                html += `<li data-list="bullet" class="ql-size-large"><span class="ql-ui" contenteditable="false"></span>${locationParts} ${jobType}</li>`;
                            });
                            html += `</ol></div>`;
                        }
                    }

                    break;
                }

                case 'job requirements':
                    html += `
            <h1><u>Job Requirements</u></h1>
            ${item.data || ''}
            `;
                    break;

                case 'job responsibilities':
                    html += `
              <h1><u>Job Responsibilities</u></h1>
              ${item.data}
            `;
                    break;

                default:
                    // Fallback for any new default sections, if any
                    html += `
              <h2>${item.title || ''}</h2>
              ${item.data}
            `;
            }
        } else {
            // For custom sections
            html += `
            <h1><u>${item.title}</u></h1>
              ${item.data}
        `;
        }
    });
    return html;
};
