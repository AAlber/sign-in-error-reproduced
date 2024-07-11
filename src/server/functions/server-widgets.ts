import { getUpcomingInvoice } from "@/src/client-functions/client-stripe";
import {
  formatStripeMoney,
  getPlanInformations,
} from "@/src/client-functions/client-stripe/utils";
import { formatNumber } from "@/src/client-functions/client-utils";
import { prisma } from "../db/client";
import { stripe } from "../singletons/stripe";
import {
  getTotalActiveUsersOfInstitution,
  getUserIdsWithAccess,
} from "./server-role";
import { getInstitutionStripeAccount } from "./server-stripe/db-requests";

export const getWidgetData = async (id: string, institutionId: string) => {
  switch (id) {
    case "total_users": {
      return await getTotalUsers(institutionId);
    }
    case "total_courses": {
      return await getTotalCourses(institutionId);
    }
    case "total_appointments": {
      return await getTotalAppointments(institutionId);
    }
    case "ai_usage": {
      return await getAiUsage(institutionId);
    }
    case "next_invoice": {
      return await getNextInvoiceInfo(institutionId);
    }
    case "current_plan": {
      return await getCurrentPlan(institutionId);
    }
    default:
      return {
        primaryData: "0",
        secondaryData: "No Data",
      };
  }
};

export const getCurrentPlan = async (institutionId: string) => {
  const instiStripeAccount = await getInstitutionStripeAccount(institutionId);
  if (
    instiStripeAccount &&
    instiStripeAccount.customerId &&
    instiStripeAccount.subscriptionId
  ) {
    const { subscriptionId } = instiStripeAccount;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const plan = getPlanInformations(subscription.items.data[0]?.quantity);
    const totalUsers = await getTotalActiveUsersOfInstitution(
      instiStripeAccount.institutionId,
      false,
    );
    const subscriptionTotal = subscription.items.data[0]?.quantity;
    return {
      primaryData: `${totalUsers}/${subscriptionTotal}`,
      secondaryData: plan.description,
    };
  } else {
    throw new Error("No Stripe Account");
  }
};
const getTotalUsers = async (institutionId: string) => {
  const totalUsers = await getTotalActiveUsersOfInstitution(
    institutionId,
    true,
  );
  return {
    primaryData: totalUsers.toString(),
    secondaryData: "",
  };
};

export const getTotalCourses = async (institutionId: string) => {
  const [totalCourses, averageUsersPerCourse] = await Promise.all([
    getAllCoursesOfInstitution(institutionId),
    getAverageUsersPerCourse(institutionId),
  ]);
  return {
    primaryData: formatNumber(totalCourses.length).toString(),
    secondaryData: `admin_dashboard.total_courses_widget_description`,
    variables: [formatNumber(averageUsersPerCourse).toString()],
  };
};

export const getTotalAppointments = async (institutionId: string) => {
  const totalAppointmentsToday = await getTotalAppointmentsToday(institutionId);
  const totalAppointmentsThisWeek =
    await getTotalAppointmentsThisWeek(institutionId);
  return {
    primaryData: formatNumber(totalAppointmentsToday).toString(),
    secondaryData: `admin_dashboard.total_appointments_widget_description`,
    variables: [formatNumber(totalAppointmentsThisWeek).toString()],
  };
};

// broken
export const getAiUsage = async (institutionId: string) => {
  return {
    primaryData: formatNumber(1000).toString(),
    secondaryData: `admin_dashboard.ai_usage_widget_description`,
    variables: [formatNumber(0).toString()],
  };
};

export const getNextInvoiceInfo = async (institutionId: string) => {
  const instiStripeAccount = await getInstitutionStripeAccount(institutionId);
  if (
    instiStripeAccount &&
    instiStripeAccount.customerId &&
    instiStripeAccount.subscriptionId
  ) {
    const { customerId, subscriptionId } = instiStripeAccount;
    const upcomingInvoice = await getUpcomingInvoice(
      subscriptionId,
      customerId,
    );

    if (upcomingInvoice) {
      const invoice = upcomingInvoice;
      const amount = formatStripeMoney(invoice.amount_due);
      const daysLeft = Math.floor(
        (new Date(invoice.period_end * 1000).getTime() - new Date().getTime()) /
          (1000 * 3600 * 24),
      );

      return {
        primaryData: amount,
        secondaryData: `admin_dashboard.next_invoice_widget_description`,
        variables: [daysLeft.toString()],
      };
    } else {
      throw new Error("No upcoming invoices found.");
    }
  } else {
    throw new Error("No Stripe Account");
  }
};

export const getAllCoursesOfInstitution = async (institutionId: string) => {
  const courses = await prisma.course.findMany({
    where: {
      institution_id: institutionId,
    },
  });
  return courses;
};

export async function getAverageUsersPerCourse(institutionId: string) {
  const courses = await prisma.course.findMany({
    where: {
      institution_id: institutionId,
    },
    select: {
      layer_id: true,
    },
  });

  const coursesWithId: { layer_id: string; count: number }[] = [];

  const coursePromises = courses.map(async (course) => {
    const count = await getUserIdsWithAccess(course.layer_id);
    coursesWithId.push({ layer_id: course.layer_id, count: count.length });
  });

  await Promise.all(coursePromises);

  const average =
    coursesWithId.reduce((acc, course) => {
      return acc + course.count;
    }, 0) / coursesWithId.length;

  return average;
}

export const getTotalAppointmentsOfInstitution = async (
  institutionId: string,
) => {
  const appointments = await prisma.appointment.findMany({
    where: {
      appointmentLayers: {
        some: {
          layer: {
            institution_id: institutionId,
          },
        },
      },
    },
  });

  return appointments;
};

export const getTotalAppointmentsToday = async (institutionId: string) => {
  const appointments = await getTotalAppointmentsOfInstitution(institutionId);

  const appointmentsToday = appointments.filter((appointment) => {
    const today = new Date();
    const appointmentDate = new Date(appointment.dateTime);
    return (
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear()
    );
  });

  const totalAppointmentsToday = appointmentsToday.length;
  return totalAppointmentsToday;
};

export const getTotalAppointmentsThisWeek = async (institutionId: string) => {
  const appointments = await getTotalAppointmentsOfInstitution(institutionId);

  // Helper function to get the start and end dates of the current week
  const getStartOfWeek = (date: Date) => {
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  };

  const getEndOfWeek = (date: Date) => {
    const dayOfWeek = date.getDay();
    const endOfWeek = new Date(date);
    endOfWeek.setDate(endOfWeek.getDate() + (6 - dayOfWeek));
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  };

  const today = new Date();
  const startOfWeek = getStartOfWeek(today);
  const endOfWeek = getEndOfWeek(today);

  const appointmentsThisWeek = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.dateTime);
    return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
  });

  const totalAppointmentsThisWeek = appointmentsThisWeek.length;
  return totalAppointmentsThisWeek;
};
